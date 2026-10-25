/**
 * html2.link 发布插件 —— Host 半区。
 * 职责：注册 agent 工具，把当前项目 / 对话中的 HTML 发布到 html2.link；
 *       并注册同源 HTTP 代理，供 Client 登录页在浏览器里安全调用 html2.link 接口（规避 CORS）。
 */

const DEFAULT_BASE = 'https://html2.link';
const NS_NAME = '@local/html2link-bundle';

export const Config = {
  type: 'object',
  properties: {
    token: { type: 'string', description: 'html2.link 的 AI Token（htl_ 开头）。' },
    baseUrl: { type: 'string', description: 'html2.link 站点地址，默认 https://html2.link' },
  },
  additionalProperties: false,
};

function baseUrlOf(config) {
  const raw = (config && config.baseUrl) || DEFAULT_BASE;
  return String(raw).replace(/\/+$/, '');
}

function tokenOf(config) {
  const t = config && typeof config.token === 'string' ? config.token.trim() : '';
  return t;
}

function reasonOf(status, payload) {
  const d = (payload && payload.data) || {};
  return (
    d.reason ||
    (payload && payload.msg) ||
    (payload && payload.statusMessage) ||
    (payload && payload.message) ||
    `HTTP ${status}`
  );
}

function textResult(text) {
  return text;
}

function outputSchema() {
  return {
    schema: { type: 'string' },
    render(_args, value) {
      return [{ type: 'text', text: String(value) }];
    },
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchMe(base, token, signal) {
  const res = await fetch(`${base}/api/user/me`, { headers: { Authorization: `Bearer ${token}` }, signal });
  const body = await readJson(res);
  if (!res.ok || (body && body.code !== undefined && body.code !== 0)) {
    const err = new Error(reasonOf(res.status, body));
    err.status = res.status;
    throw err;
  }
  return (body && body.data) || {};
}

async function postPage(base, token, payload, signal) {
  const res = await fetch(`${base}/api/pages/ai`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal,
  });
  const body = await readJson(res);
  const data = (body && body.data) || {};
  const url = typeof data.url === 'string' ? data.url.trim() : '';
  const ok = res.ok && body && body.code === 0 && !data.auditRejected && url;
  if (!ok) {
    if (data.auditRejected) throw new Error(`内容审核不通过：${data.reason || '未给出原因'}（未生成链接）`);
    const err = new Error(reasonOf(res.status, body));
    err.status = res.status;
    throw err;
  }
  return data;
}

function registerProxy(ctx, state) {
  const handler = async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      const upstream = url.pathname.replace(/^\/html2link-api/, '') || '/';
      const base = baseUrlOf(state.config);

      const send = (status, type, buf) => {
        res.statusCode = status;
        res.setHeader('Content-Type', type);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key, If-Match');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
        res.end(buf);
      };
      const sendJson = (status, obj) => send(status, 'application/json; charset=utf-8', JSON.stringify(obj));

      if (req.method === 'OPTIONS') return send(204, 'text/plain', Buffer.alloc(0));

      const readBody = async () => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        return Buffer.concat(chunks);
      };

      if (upstream === '/state') {
        return sendJson(200, { token: tokenOf(state.config), baseUrl: baseUrlOf(state.config) });
      }
      if (upstream === '/__save-token' && req.method === 'POST') {
        const raw = (await readBody()).toString('utf-8');
        let next = '';
        try {
          const parsed = JSON.parse(raw || '{}');
          next = typeof parsed.token === 'string' ? parsed.token.trim() : '';
        } catch {
          next = '';
        }
        try {
          await ctx.configEditor.edit({ name: NS_NAME }, current => ({ ...current, token: next }));
        } catch (e) {
          /* 配置服务不可用时仅更新本次运行时状态 */
        }
        state.config = { ...state.config, token: next };
        return sendJson(200, { code: 0, token: next });
      }

      const headers = {};
      const auth = req.headers['authorization'];
      if (auth) headers.Authorization = auth;
      const idem = req.headers['idempotency-key'];
      if (idem) headers['Idempotency-Key'] = idem;
      const ifMatch = req.headers['if-match'];
      if (ifMatch) headers['If-Match'] = ifMatch;

      let body = null;
      const raw = await readBody();
      if (raw.length) {
        body = raw;
        const ct = req.headers['content-type'];
        if (ct) headers['Content-Type'] = ct;
      }

      const upstreamRes = await fetch(`${base}${upstream}${url.search}`, {
        method: req.method || 'GET',
        headers,
        body: body && req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
      });
      const buf = Buffer.from(await upstreamRes.arrayBuffer());
      const type = upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8';
      res.statusCode = upstreamRes.status;
      res.setHeader('Content-Type', type);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key, If-Match');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
      res.end(buf);
    } catch (error) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ code: -1, msg: error && error.message ? error.message : 'proxy failed' }));
    }
  };

  const shapes = [
    { path: '/html2link-api', handler },
    { pattern: '/html2link-api', handler },
    { pathname: '/html2link-api', handler },
    { route: '/html2link-api', handler },
    { path: /^\/html2link-api(\/|$)/, handler },
  ];
  for (const shape of shapes) {
    try {
      ctx.webServer && ctx.webServer.register && ctx.webServer.register(shape);
      return true;
    } catch (e) {
      /* 尝试下一个形状 */
    }
  }
  return false;
}

export function apply(ctx, config) {
  const state = { config: config || {} };

  try {
    registerProxy(ctx, state);
  } catch (e) {
    /* 代理注册失败不阻塞工具注册 */
  }

  try {
    ctx.effect(() =>
      ctx.tools.register({
        name: 'html2link_account',
        description: '读取 html2.link 账户信息：套餐、可用积分、每日消耗，用于判断能否自动续期发布。',
        parameters: { type: 'object', properties: {}, additionalProperties: false },
        output: outputSchema(),
        async execute(args, context) {
          const token = tokenOf(state.config);
          if (!token) return textResult('未配置 Token：请在设置 → "html2.link 发布" 页面登录或粘贴 AI Token。');
          const signal = context && context.signal;
          try {
            const me = await fetchMe(baseUrlOf(state.config), token, signal);
            const credits = me.totalCredits ?? me.credits ?? 0;
            return textResult(
              [
                `套餐：${me.tier ?? '未知'}`,
                `可用积分：${credits}`,
                `每日到账：${me.dailyCredits ?? 0}（激活后 ${me.dailyCreditsAfterActivation ?? 0}）`,
                `每日消耗：${me.totalDailyConsumption ?? 0}`,
                `已发布页面：${me.pageCount ?? 0}`,
                `预计剩余天数：${me.estimatedDaysLeft ?? -1}（-1 表示充足）`,
              ].join('\n'),
            );
          } catch (error) {
            if (error && error.status === 401) {
              return textResult('Token 无效或已重新生成：请到设置 → "html2.link 发布" 页面重新登录获取新 Token，不要重试旧 Token。');
            }
            if (error && error.status === 402) return textResult('积分不足：请到 https://html2.link/credits 处理。');
            return textResult(`读取账户失败：${error && error.message ? error.message : error}`);
          }
        },
      }),
    );
  } catch (e) {
    /* 工具注册失败由宿主诊断 */
  }

  try {
    ctx.effect(() =>
      ctx.tools.register({
        name: 'html2link_publish',
        description: '把一段完整的单文件 HTML 发布到 html2.link 并返回可访问链接。用于发布当前项目或对话中最新的网页。',
        parameters: {
          type: 'object',
          properties: {
            html: { type: 'string', description: '完整的单文件 HTML 文档（UTF-8），本地图片需已内联为 data URI。' },
            title: { type: 'string', description: '页面标题，省略时由 html2.link 自动提取。' },
            renewMode: { type: 'string', enum: ['auto', 'fixed'], description: '续期模式，默认 auto。' },
            expireDays: { type: 'integer', minimum: 1, maximum: 365, description: '仅 renewMode=fixed 时生效，1～365 天。' },
          },
          required: ['html'],
          additionalProperties: false,
        },
        output: outputSchema(),
        async execute(args, context) {
          const token = tokenOf(state.config);
          if (!token) return textResult('未配置 Token：请在设置 → "html2.link 发布" 页面登录或粘贴 AI Token。');
          const html = typeof args.html === 'string' ? args.html : '';
          if (!html.trim()) return textResult('html 为空：请提供完整的 HTML 文档。');
          if (!/<\s*(!doctype|html)/i.test(html)) {
            return textResult('html 看起来不是完整文档：请传入包含 <!DOCTYPE html> 或 <html> 的完整页面。');
          }
          const payload = { html, renewMode: args.renewMode === 'fixed' ? 'fixed' : 'auto' };
          if (args.title) payload.title = String(args.title);
          if (payload.renewMode === 'fixed' && args.expireDays) payload.expireDays = args.expireDays;
          try {
            const data = await postPage(baseUrlOf(state.config), token, payload, context && context.signal);
            const lines = [
              `发布成功：${data.url}`,
              `标题：${data.title || '(自动提取)'}`,
              `续期：${data.renewMode || 'auto'}${data.expireAt ? `，到期 ${data.expireAt}` : ''}`,
              `剩余积分：${data.creditsRemaining ?? '未知'}`,
            ];
            if (data.imagesUploaded) lines.push(`上传图片：${data.imagesUploaded} 张`);
            return textResult(lines.join('\n'));
          } catch (error) {
            const message = error && error.message ? error.message : String(error);
            if (error && error.status === 401) {
              return textResult('Token 无效或已重新生成：请到设置 → "html2.link 发布" 页面重新登录获取新 Token，不要重试旧 Token。');
            }
            if (error && error.status === 402) return textResult('积分不足：请到 https://html2.link/credits 处理。');
            if (error && error.status === 429) return textResult('频率限制：每小时最多 30 次，请稍后再试。');
            return textResult(`发布失败：${message}`);
          }
        },
      }),
    );
  } catch (e) {
    /* 工具注册失败由宿主诊断 */
  }
}