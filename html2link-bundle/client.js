window.__ModuleLoader__.load({
  id: '@local/html2link-bundle',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = '@local/html2link-bundle';
    const PROXY = '/html2link-api';

    const css = `
.htl-card{background:var(--dsw-alias-surface,#fff);border:1px solid var(--dsw-alias-border,rgba(0,0,0,.1));border-radius:14px;padding:24px;max-width:440px;margin:24px auto;text-align:center}
.htl-h1{font-size:26px;font-weight:600;margin:0 0 4px;color:var(--dsw-alias-ink,#1d1d1f);letter-spacing:-.28px}
.htl-sub{font-size:13px;color:var(--dsw-alias-ink-muted,rgba(0,0,0,.45));margin:0 0 18px}
.htl-tabs{display:flex;background:var(--dsw-alias-chip,rgba(0,0,0,.05));border:1px solid var(--dsw-alias-border,rgba(0,0,0,.1));border-radius:999px;overflow:hidden;margin-bottom:20px}
.htl-tab{flex:1;background:transparent;border:none;color:var(--dsw-alias-ink-muted,rgba(0,0,0,.45));font:inherit;font-size:13px;padding:9px 10px;cursor:pointer;transition:all .15s}
.htl-tab[data-on="1"]{background:var(--dsw-alias-surface,#fff);color:var(--dsw-alias-accent,#0066cc);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.htl-qr{background:var(--dsw-alias-chip,rgba(0,0,0,.05));border-radius:16px;width:220px;height:220px;margin:0 auto;display:flex;align-items:center;justify-content:center;overflow:hidden}
.htl-qr img{width:100%;height:100%;object-fit:contain}
.htl-status{font-size:13px;color:var(--dsw-alias-ink-muted,rgba(0,0,0,.45));text-align:center;margin-top:12px;line-height:1.6}
.htl-form{display:flex;flex-direction:column;gap:12px;text-align:left}
.htl-input{width:100%;box-sizing:border-box;background:var(--dsw-alias-surface,#fff);border:1px solid var(--dsw-alias-border,rgba(0,0,0,.16));border-radius:9px;color:var(--dsw-alias-ink,#1d1d1f);font:inherit;font-size:14px;padding:10px 12px}
.htl-input:focus{outline:2px solid var(--dsw-alias-accent,#0066cc);outline-offset:-1px}
.htl-btn{background:var(--dsw-alias-accent,#0066cc);border:none;border-radius:999px;color:#fff;cursor:pointer;font:inherit;font-size:14px;padding:10px 18px;transition:background .15s,transform .05s}
.htl-btn:hover:not(:disabled){background:var(--dsw-alias-accent-hover,#0057b8)}
.htl-btn:active:not(:disabled){transform:scale(.97)}
.htl-btn:disabled{opacity:.5;cursor:not-allowed}
.htl-btn--ghost{background:transparent;border:1px solid var(--dsw-alias-border,rgba(0,0,0,.2));color:var(--dsw-alias-ink,rgba(0,0,0,.7))}
.htl-row{display:flex;gap:8px;align-items:center;justify-content:space-between;background:var(--dsw-alias-chip,rgba(0,0,0,.05));border-radius:10px;padding:12px 14px;margin-bottom:16px;text-align:left}
.htl-row b{font-size:13px;color:var(--dsw-alias-ink,#1d1d1f)}
.htl-row span{display:block;font-size:12px;color:var(--dsw-alias-ink-muted,rgba(0,0,0,.45));margin-top:2px;word-break:break-all}
.htl-badge{font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:#e8f2ff;color:#0066cc;white-space:nowrap}
.htl-badge[data-on="0"]{background:rgba(0,0,0,.07);color:rgba(0,0,0,.45)}
.htl-msg{font-size:13px;line-height:1.6;margin-top:12px;text-align:left;padding:10px 12px;border-radius:8px;background:var(--dsw-alias-chip,rgba(0,0,0,.05));color:var(--dsw-alias-ink-muted,rgba(0,0,0,.6));word-break:break-word}
.htl-msg[data-kind="ok"]{background:rgba(52,199,89,.12);color:#1f8f3f}
.htl-msg[data-kind="err"]{background:rgba(255,59,48,.1);color:#c9342b}
.htl-link{display:inline-block;margin-top:14px;font-size:13px;color:var(--dsw-alias-accent,#0066cc);text-decoration:none}
.htl-link:hover{text-decoration:underline}
.htl-actions{display:flex;gap:8px;margin-top:16px}
`;

    // 文案回退表：Client locale 服务未提供该命名空间时使用（与 locale/zh.json 对齐）。
    const FALLBACK = {
      title: 'html2.link 发布',
      subtitle: '登录后把当前项目或对话里的最新网页发布成可分享链接',
      tabWechat: '微信扫码登录',
      tabEmail: '邮箱密码登录',
      tabManual: '已有 Token',
      qrHint: '请使用微信扫描二维码登录',
      qrCountdown: '剩余 {n} 秒',
      qrExpired: '二维码已过期，点击刷新',
      qrLoading: '正在获取二维码…',
      qrUnsupported: '微信登录接口暂不可用：未拿到 html2.link 的扫码接口地址。请切换到「已有 Token」，或在 html2.link/login 登录后到 /ai-publish 复制 AI Token。',
      emailPlaceholder: '邮箱',
      passwordPlaceholder: '密码',
      submitLogin: '登录并获取 Token',
      emailUnsupported: '邮箱登录接口暂不可用：未拿到 html2.link 的邮箱登录接口地址。请切换到「已有 Token」。',
      manualPlaceholder: '粘贴 htl_ 开头的 AI Token',
      save: '保存 Token',
      clear: '退出登录',
      saved: '已保存',
      unsaved: '未登录',
      account: '账户',
      credits: '可用积分',
      publish: '发布最新网页',
      publishing: '发布中…',
      needToken: '请先登录或粘贴 Token',
      sourceDoc: '查看发布文档',
    };

    let LOCALE_T = null;

    function makeT(dict) {
      return key => {
        if (LOCALE_T) {
          try {
            const value = LOCALE_T(key.replace(/^page\./, ''));
            if (typeof value === 'string' && value && value !== key.replace(/^page\./, '')) return value;
          } catch {
            /* 该命名空间未注册时回退到内置文案 */
          }
        }
        const path = key.split('.');
        let node = dict;
        for (const part of path) node = node && node[part];
        if (typeof node === 'string' && node) return node;
        const last = path[path.length - 1];
        return FALLBACK[last] || key;
      };
    }

    function Login({ t, token, onSaved }) {
      const [tab, setTab] = React.useState('wechat');
      const [busy, setBusy] = React.useState(false);
      const [msg, setMsg] = React.useState(null);
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [manual, setManual] = React.useState('');
      const [qr, setQr] = React.useState(null);
      const [left, setLeft] = React.useState(0);

      // 微信扫码：向 html2.link 申请小程序码并轮询扫码结果。
      React.useEffect(() => {
        if (tab !== 'wechat') return undefined;
        let alive = true;
        let timer = null;
        (async () => {
          setQr(null);
          setMsg({ kind: null, text: t('page.qrLoading') });
          try {
            const res = await fetch(`${PROXY}/auth/wechat/qrcode`, { method: 'POST' });
            const body = await res.json().catch(() => null);
            if (!alive) return;
            const image = body && body.data && (body.data.qrCodeUrl || body.data.image || body.data.url);
            const expire = (body && body.data && body.data.expireIn) || 120;
            if (!image) throw new Error((body && (body.msg || body.message)) || `HTTP ${res.status}`);
            setQr(image);
            setLeft(expire);
            setMsg({ kind: null, text: t('page.qrHint') });
            const scene = body.data.scene || body.data.sceneId || body.data.token;
            const started = Date.now();
            const poll = async () => {
              if (!alive) return;
              try {
                const r = await fetch(`${PROXY}/auth/wechat/poll?scene=${encodeURIComponent(scene)}`);
                const b = await r.json().catch(() => null);
                const got = b && b.data && (b.data.token || b.data.aiToken);
                if (got) {
                  onSaved(got);
                  setMsg({ kind: 'ok', text: t('page.saved') });
                  return;
                }
              } catch {
                /* 继续轮询 */
              }
              const remain = Math.max(0, expire - Math.round((Date.now() - started) / 1000));
              setLeft(remain);
              if (remain <= 0) {
                setMsg({ kind: 'err', text: t('page.qrExpired') });
                return;
              }
              timer = setTimeout(poll, 2500);
            };
            timer = setTimeout(poll, 2500);
          } catch (error) {
            if (alive) setMsg({ kind: 'err', text: `${t('page.qrUnsupported')}\n${error && error.message ? error.message : ''}` });
          }
        })();
        return () => {
          alive = false;
          if (timer) clearTimeout(timer);
        };
      }, [tab]);

      async function submitEmail(e) {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        try {
          const res = await fetch(`${PROXY}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ email, password }),
          });
          const body = await res.json().catch(() => null);
          const got = body && body.data && (body.data.token || body.data.aiToken || body.data.accessToken);
          if (!res.ok || !got) {
            throw new Error((body && (body.msg || body.message || body.statusMessage)) || `HTTP ${res.status}`);
          }
          onSaved(got);
          setMsg({ kind: 'ok', text: t('page.saved') });
        } catch (error) {
          setMsg({ kind: 'err', text: `${t('page.emailUnsupported')}\n${error && error.message ? error.message : ''}` });
        } finally {
          setBusy(false);
        }
      }

      async function saveManual(e) {
        e.preventDefault();
        const value = manual.trim();
        if (!value) return;
        setBusy(true);
        try {
          await onSaved(value);
          setManual('');
          setMsg({ kind: 'ok', text: t('page.saved') });
        } finally {
          setBusy(false);
        }
      }

      return h(
        'div',
        { className: 'htl-card' },
        h('h1', { className: 'htl-h1' }, t('page.title')),
        h('p', { className: 'htl-sub' }, t('page.subtitle')),
        h(
          'div',
          { className: 'htl-tabs', role: 'tablist' },
          [
            ['wechat', t('page.tabWechat')],
            ['email', t('page.tabEmail')],
            ['manual', t('page.tabManual')],
          ].map(([key, label]) =>
            h(
              'button',
              {
                key,
                type: 'button',
                role: 'tab',
                className: 'htl-tab',
                'data-on': tab === key ? '1' : '0',
                'aria-selected': tab === key ? 'true' : 'false',
                onClick: () => {
                  setTab(key);
                  setMsg(null);
                },
              },
              label,
            ),
          ),
        ),
        tab === 'wechat'
          ? h(
              'div',
              null,
              h('div', { className: 'htl-qr' }, qr ? h('img', { src: qr, alt: t('page.qrHint') }) : h('span', { className: 'htl-status' }, t('page.qrLoading'))),
              h('p', { className: 'htl-status' }, left > 0 ? t('page.qrCountdown').replace('{n}', String(left)) : t('page.qrHint')),
            )
          : null,
        tab === 'email'
          ? h(
              'form',
              { className: 'htl-form', onSubmit: submitEmail },
              h('input', {
                className: 'htl-input',
                type: 'email',
                required: true,
                autoComplete: 'username',
                placeholder: t('page.emailPlaceholder'),
                value: email,
                onChange: e => setEmail(e.target.value),
              }),
              h('input', {
                className: 'htl-input',
                type: 'password',
                required: true,
                autoComplete: 'current-password',
                placeholder: t('page.passwordPlaceholder'),
                value: password,
                onChange: e => setPassword(e.target.value),
              }),
              h('button', { className: 'htl-btn', type: 'submit', disabled: busy }, t('page.submitLogin')),
            )
          : null,
        tab === 'manual'
          ? h(
              'form',
              { className: 'htl-form', onSubmit: saveManual },
              h('input', {
                className: 'htl-input',
                type: 'text',
                required: true,
                spellCheck: false,
                autoComplete: 'off',
                placeholder: t('page.manualPlaceholder'),
                value: manual,
                onChange: e => setManual(e.target.value),
              }),
              h('button', { className: 'htl-btn', type: 'submit', disabled: busy }, t('page.save')),
            )
          : null,
        msg ? h('div', { className: 'htl-msg', 'data-kind': msg.kind || '' }, msg.text) : null,
        h(
          'a',
          { className: 'htl-link', href: 'https://html2.link/ai', target: '_blank', rel: 'noreferrer' },
          t('page.sourceDoc'),
        ),
      );
    }

    function SettingsPage() {
      const [dict, setDict] = React.useState({});
      const [state, setState] = React.useState({ token: '', account: null, error: '' });
      const [busy, setBusy] = React.useState(false);
      const [result, setResult] = React.useState(null);

      React.useEffect(() => {
        let alive = true;
        (async () => {
          try {
            const res = await fetch(`${PROXY}/state`);
            const body = await res.json();
            if (alive) setState(prev => ({ ...prev, token: (body && body.token) || '' }));
          } catch (error) {
            if (alive) setState(prev => ({ ...prev, error: error && error.message ? error.message : String(error) }));
          }
        })();
        return () => {
          alive = false;
        };
      }, []);

      const t = React.useCallback(key => makeT(dict)[key], [dict]);

      async function refreshAccount(nextToken) {
        const value = typeof nextToken === 'string' ? nextToken : state.token;
        if (!value) {
          setState(prev => ({ ...prev, account: null }));
          return;
        }
        try {
          const res = await fetch(`${PROXY}/api/user/me`, { headers: { Authorization: `Bearer ${value}` } });
          const body = await res.json().catch(() => null);
          if (res.ok && body && body.code === 0) setState(prev => ({ ...prev, account: body.data, error: '' }));
          else setState(prev => ({ ...prev, account: null, error: (body && (body.msg || body.message)) || `HTTP ${res.status}` }));
        } catch (error) {
          setState(prev => ({ ...prev, account: null, error: error && error.message ? error.message : String(error) }));
        }
      }

      async function saveToken(value) {
        setBusy(true);
        try {
          setState(prev => ({ ...prev, token: value }));
          await fetch(`${PROXY}/__save-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ token: value }),
          });
          await refreshAccount(value);
        } finally {
          setBusy(false);
        }
      }

      async function publish() {
        setBusy(true);
        setResult(null);
        try {
          const value = state.token;
          if (!value) {
            setResult({ kind: 'err', text: t('page.needToken') });
            return;
          }
          const html = window.__html2link_draft;
          if (!html) {
            setResult({ kind: 'err', text: '未找到待发布内容：请让 agent 调用 html2link_publish 工具发布当前网页。' });
            return;
          }
          const res = await fetch(`${PROXY}/api/pages/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${value}` },
            body: JSON.stringify({ html, renewMode: 'auto' }),
          });
          const body = await res.json().catch(() => null);
          const data = (body && body.data) || {};
          if (res.ok && body && body.code === 0 && !data.auditRejected && data.url) {
            setResult({ kind: 'ok', text: data.url });
          } else {
            setResult({ kind: 'err', text: (body && (body.msg || data.reason)) || `HTTP ${res.status}` });
          }
        } catch (error) {
          setResult({ kind: 'err', text: error && error.message ? error.message : String(error) });
        } finally {
          setBusy(false);
        }
      }

      React.useEffect(() => {
        if (state.token) refreshAccount(state.token);
      }, [state.token]);

      const account = state.account;
      return h(
        'div',
        { className: 'htl-card' },
        h(
          'div',
          { className: 'htl-row' },
          h(
            'div',
            null,
            h('b', null, t('page.account')),
            h(
              'span',
              null,
              account
                ? `${account.tier || '-'} · ${t('page.credits')} ${account.totalCredits ?? account.credits ?? 0}`
                : state.token
                  ? state.error || t('page.unsaved')
                  : t('page.unsaved'),
            ),
          ),
          h('span', { className: 'htl-badge', 'data-on': state.token ? '1' : '0' }, state.token ? t('page.saved') : t('page.unsaved')),
        ),
        h(Login, { t, token: state.token, onSaved: saveToken }),
        h(
          'div',
          { className: 'htl-actions' },
          h('button', { className: 'htl-btn', type: 'button', disabled: busy || !state.token, onClick: publish }, busy ? t('page.publishing') : t('page.publish')),
          state.token
            ? h(
                'button',
                {
                  className: 'htl-btn htl-btn--ghost',
                  type: 'button',
                  onClick: () => saveToken(''),
                },
                t('page.clear'),
              )
            : null,
        ),
        result ? h('div', { className: 'htl-msg', 'data-kind': result.kind }, result.text) : null,
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        try {
          if (ctx.locale && typeof ctx.locale.bind === 'function') LOCALE_T = ctx.locale.bind(NS);
        } catch {
          LOCALE_T = null;
        }

        const style = document.createElement('style');
        style.setAttribute('data-htl', NS);
        style.textContent = css;
        document.head.appendChild(style);
        ctx.effect(() => () => style.remove());

        ctx.effect(() =>
          ctx.slots.inject('settings.section', () =>
            ctx.slots.register(
              { name: 'settings.section', id: NS, order: 60, label: () => 'html2.link 发布' },
              SettingsPage,
            ),
          ),
        );
      },
    };
  },
});
