'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Secret Raffle</span>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Secret Raffle</span>
            </a>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">功能特点</a>
            <a href="#how-it-works" className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">如何使用</a>
            <a href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener noreferrer" className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">技术文档</a>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => router.push('/dapp')}
              className="text-sm/6 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              进入 DApp <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background gradient */}
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          {/* Announcement Badge */}
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10 dark:hover:ring-white/20">
              结合 Web3 与 Web2 社交的创新抽奖平台
              <a href="https://www.zama.ai/" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400">
                <span aria-hidden="true" className="absolute inset-0" />
                技术文档 <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
              Secret Raffle · 机密抽奖
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              首个基于全同态加密（FHE）的 Web3 抽奖平台。支持多种玩法、多社交平台接入，让每一次抽奖都公平透明、自动兑现。🎮 当前体验版：猜数字游戏
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => router.push('/dapp')}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                立即开始
              </button>
              <a href="#how-it-works" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                了解更多 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              传统抽奖平台的痛点
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Web2 抽奖存在诸多问题，用户权益难以保障
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Pain Point 1 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-red-600 p-2 dark:bg-red-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  不公平黑盒
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    抽奖过程完全不透明，后台操作无法监督，用户无法验证结果的真实性，内定中奖屡见不鲜。
                  </p>
                </dd>
              </div>

              {/* Pain Point 2 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-red-600 p-2 dark:bg-red-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  兑奖困难
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    中奖后发起者可以随意拒绝兑奖，找各种借口拖延或取消，用户维权成本高且成功率低。
                  </p>
                </dd>
              </div>

              {/* Pain Point 3 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-red-600 p-2 dark:bg-red-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  玩法单一
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    只能要求关注、转发等简单操作，缺乏趣味性和互动性，无法满足不同场景的需求。
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              为什么选择 Secret Raffle
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              结合 Web3 与 Web2 社交的创新抽奖平台，让每一次抽奖都公平透明
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-indigo-600 p-2 dark:bg-indigo-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  透明机制，绝对公平
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    所有抽奖逻辑在区块链上公开执行，智能合约开源可审计，采用 FHE 加密技术保护隐私的同时确保结果无法篡改，真正做到公平公正。
                  </p>
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-indigo-600 p-2 dark:bg-indigo-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  奖品预存，实时到账
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    奖品必须提前锁定在智能合约中，中奖后自动转账到账，无需人工审核。支持设置代币/NFT持有条件，筛选优质参与者。
                  </p>
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="rounded-lg bg-indigo-600 p-2 dark:bg-indigo-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  多种玩法，丰富互动
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    支持传统抽奖、猜数字、预测游戏等多种玩法。可扩展接入 Twitter、Telegram、Discord 等社交平台作为参与条件，玩法持续创新。
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              体验第一个 Demo：猜数字游戏
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              简单三步，体验 Web3 + Web2 社交的全新抽奖方式。未来将支持更多玩法（抽奖、预测等）和多社交平台登录（Twitter、Telegram、Discord）
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative flex gap-x-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold dark:bg-indigo-500">
                    1
                  </div>
                  <div className="mt-4 h-full w-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                    连接 Web3 钱包
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    使用 MetaMask 等 Web3 钱包连接到 Sepolia 测试网，这是参与游戏的身份凭证。
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-x-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold dark:bg-indigo-500">
                    2
                  </div>
                  <div className="mt-4 h-full w-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                    填写推特链接 + 猜数字
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    输入你的 Twitter 个人主页链接（Web2 社交身份）和猜测的数字（0-10000），系统会使用 FHE 加密你的猜测。
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold dark:bg-indigo-500">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                    查看结果，无限挑战
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    区块链计算完成后，你可以解密查看自己的结果。猜错了？没关系，可以无限次尝试，直到找到正确答案！
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="mt-12 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div className="text-sm text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold mb-1">🚀 这是第一个技术验证 Demo</p>
                  <p className="text-indigo-700 dark:text-indigo-300 text-xs">
                    未来版本将支持：真实抽奖（奖品预存、自动分发）、多种玩法（随机抽奖、预测竞猜）、多平台登录（Twitter、Telegram、Discord）、代币/NFT 门槛设置等功能。
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <button
                onClick={() => router.push('/dapp')}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                🎮 立即开始猜数字
              </button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                需要 Sepolia 测试网 ETH · 免费获取：<a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Sepolia Faucet</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              基于 <a href="https://www.zama.ai/" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Zama FHEVM</a> 构建 · 
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">完全开源</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
