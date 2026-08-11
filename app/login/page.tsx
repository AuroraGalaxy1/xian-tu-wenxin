'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const name = username.trim();
    if (name.length < 2 || name.length > 20) {
      setError('用户名需为 2-20 个字符');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    if (mode === 'register' && password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }

    setSubmitting(true);
    const result =
      mode === 'login' ? await login(name, password) : await register(name, password);
    setSubmitting(false);

    if (result.ok) {
      router.push('/');
    } else {
      setError(result.error || (mode === 'login' ? '登录失败' : '注册失败'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0806] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] glass-panel border-antique-thick corner-decoration p-8 relative">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#C9A04E] text-glow-gold tracking-widest">
            ☯ 仙途·问心
          </h1>
          <p className="mt-2 text-sm text-[#8B7A5E] tracking-widest">踏入修仙之路</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex mb-6 border-b border-[#C9A04E]/20">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-sm tracking-widest transition-colors ${
                mode === m
                  ? 'text-[#C9A04E] border-b-2 border-[#C9A04E]'
                  : 'text-[#8B7A5E] hover:text-[#C9A04E]'
              }`}
            >
              {m === 'login' ? '登 录' : '注 册'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#8B7A5E] mb-1 tracking-wider">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-2.5 bg-[#0D0A08]/60 border border-[#C9A04E]/20 rounded text-[#F0E8D8] placeholder-[#5a4e3a] outline-none focus:border-[#C9A04E]/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7A5E] mb-1 tracking-wider">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-2.5 bg-[#0D0A08]/60 border border-[#C9A04E]/20 rounded text-[#F0E8D8] placeholder-[#5a4e3a] outline-none focus:border-[#C9A04E]/60 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#8B7A5E] mb-1 tracking-wider">确认密码</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次输入密码"
                className="w-full px-4 py-2.5 bg-[#0D0A08]/60 border border-[#C9A04E]/20 rounded text-[#F0E8D8] placeholder-[#5a4e3a] outline-none focus:border-[#C9A04E]/60 transition-colors"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 tracking-wide text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 btn-antique btn-antique-primary py-3 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? mode === 'login'
                ? '登入中 ...'
                : '注册中 ...'
              : mode === 'login'
                ? '踏入仙途'
                : '立下道心'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#5a4e3a] tracking-wider">
          道友须知 · 道心即证 · 万象皆幻
        </p>
      </div>
    </div>
  );
}