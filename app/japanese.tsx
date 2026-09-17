'use client';
import { useEffect, useState, type SubmitEvent } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  Activity,
  Network,
  Cpu,
  Workflow,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Mark, Wordmark, type PageKey } from './site';

const promise = '管理する手間を増やさず、現場の仕事をひとつ減らす。';
const nav = [
  ['products', '製品・技術'],
  ['applications', '活用分野'],
  ['about', '会社紹介'],
];
const href = (page = '') => `/ja${page ? '/' + page : ''}`;
const products = [
  {
    id: 'aura',
    name: 'Aura',
    title: '状態監視センサー',
    Icon: Activity,
    body: '振動・温度・電流など、設備の状態を捉えるためのセンサー群。監視対象と設置条件に応じて構成します。',
    details:
      '10シリーズは温度・振動、11シリーズは電流の監視に対応。具体的な測定項目、設置方法、インターフェースは機種と用途に応じて確認します。',
  },
  {
    id: 'conflux',
    name: 'Conflux',
    title: 'センサーゲートウェイ',
    Icon: Network,
    body: '現場の信号を集約し、設定に応じたローカル処理を実行。設備状態とアラームを既存の PLC／DCS に連携します。',
    details:
      '設備ごとの信号と運転情報を結び付け、診断結果を現場へ返します。接続方法や処理範囲は、既設システムとプロジェクト要件に合わせて設計します。',
  },
  {
    id: 'euda',
    name: 'Euda',
    title: '設備状態監視・診断ソフトウェア',
    Icon: Cpu,
    body: '設備状態、トレンド、診断情報を一元的に確認。異常の兆候から現場確認、保全記録までをつなぎます。',
    details:
      '設備構成や監視点を整理し、状態の変化と履歴を追跡します。診断ルールと設備の物理的な故障メカニズムを組み合わせ、原因調査と保全判断を支援します。',
  },
  {
    id: 'agent',
    name: 'Agent',
    title: '設備保全 AI エージェント',
    Icon: Workflow,
    body: '設備の故障メカニズムと大規模言語モデルを組み合わせ、分析、現場確認、報告、知識の蓄積を支援します。',
    details:
      'データ収集、分析、診断・通知、現場確認、報告書作成、知識の蓄積を一連の流れとしてつなぎます。担当者による確認を組み込み、プロジェクトごとに構成しながら継続的に改善しています。',
  },
];
const industries = [
  [
    '鉄鋼',
    '外観では分からない軸受損傷の兆候を検知',
    '圧延機のローラーテーブルに振動監視と故障診断を導入。通常の巡回点検では明確な異常が見られない段階で、軸受損傷の兆候を捉えました。その後の定期修繕で転動体の損傷が確認され、交換につながりました。既存 PLC の機能を補完し、予備品の準備や保全計画に役立てています。',
  ],
  [
    'データセンター',
    '冷却設備の状態を継続的に把握',
    '冷却系統のポンプやファンを監視し、トレンドから機械的な異常の手掛かりを捉えます。現場確認と保全後の測定を組み合わせ、保全計画の判断材料を整えます。',
  ],
  [
    '半導体',
    '保全経験を追跡可能な記録へ',
    '半導体工場の重要なユーティリティ設備を対象に、状態監視、診断、現場確認、保全記録を関連付けます。設備履歴を蓄積し、交替勤務時の引き継ぎや次回の原因調査を支援します。',
  ],
  [
    '化学',
    '診断結果を修繕判断に活用',
    'ポンプなどの重要な回転機械について、振動トレンド、保全履歴、現場点検から調査範囲を絞り込みます。保全前後の状態比較により、処置結果の確認を支援します。',
  ],
  [
    '空港',
    '手荷物搬送設備の保全を計画的に',
    '手荷物搬送系統のモーターや減速機を監視し、劣化の兆候を早期に把握します。現場確認と運用予定を踏まえ、点検箇所の優先付けや予備品の準備を支援します。',
  ],
  [
    'たばこ製造',
    '生産計画に合わせた設備保全',
    '製造ラインの駆動設備やファンに対し、振動監視、トレンド分析、故障診断を適用します。生産予定に合わせた点検・保全と、必要な予備品の準備を支援します。',
  ],
  [
    '造船',
    'ガントリークレーンの駆動部を監視',
    '巻上げ・走行機構のモーターや減速機について、振動と起動・停止、負荷変動を併せて確認します。現場点検の重点箇所を明確にし、揚重作業の予定に合わせた保全につなげます。',
  ],
  [
    '銅製錬',
    '連続稼働する重要機器の劣化を把握',
    '排ガス処理や循環水系統のファン・ポンプを対象に、振動と温度を継続監視します。運転条件と現場確認を踏まえ、原因調査、予備品の準備、修繕計画を支援します。',
  ],
  [
    '蓄電システム',
    '冷却補機の状態を見守る',
    '蓄電システムの冷却循環ポンプや放熱ファンなどを対象に、運転状態と変化傾向を追跡します。故障分析と現場点検を通じて、温度管理を担う補機の保全を支援します。',
  ],
  [
    'バイオ医薬品',
    '保全判断の根拠を記録に残す',
    '製薬用水、冷却、換気系統のポンプやファンについて、監視・診断情報と現場の保全記録をつなぎます。処置前後の比較を、効果確認や担当者間の引き継ぎに活用します。',
  ],
];
function Intro({ title, body }: { title: string; body: string }) {
  return (
    <div className="page-intro wrap">
      <p className="eyebrow">交泰智能 / LinkedTi</p>
      <h1>{title}</h1>
      <p className="intro-body">{body}</p>
    </div>
  );
}
function ProductCards() {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <a
          className="product-card"
          key={p.id}
          href={href('products') + '#' + p.id}
        >
          <div className="product-top">
            <p.Icon size={28} />
            <ArrowUpRight size={20} />
          </div>
          <h3>{p.name}</h3>
          <h4>{p.title}</h4>
          <p>{p.body}</p>
        </a>
      ))}
    </div>
  );
}
function Integration() {
  return (
    <section className="integration-section wrap">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PLC / DCS 連携</p>
          <h2>
            使い慣れたシステムに、
            <br />
            設備診断の力を。
          </h2>
        </div>
        <p>
          回転数や負荷などの運転条件を踏まえて異常を捉え、診断結果を既存の操作画面へ返します。生産制御と設備診断は情報を共有しながら、実行上の役割を分けて設計します。
        </p>
      </div>
      <div className="integration-grid">
        {[
          [
            '01 / 現場',
            '信号収集とローカル処理',
            '自社開発の端末で信号を収集し、設定されたローカル処理を実行。取得可能な回転数、負荷、運転モードを異常分析の背景情報として活用します。',
          ],
          [
            '02 / 制御',
            '既存 PLC／DCS との連携',
            '設備状態とアラームを既存システムへ連携。Siemens の PLC／DCS とソリューションを統合し、Phoenix Contact の PLCnext との研究開発連携も進めています。',
          ],
          [
            '03 / 保全',
            '診断から確認、知識の蓄積へ',
            'ソフトウェアと案件に応じた Agent のワークフローで、診断、現場確認、報告、保全記録をつなぎます。担当者が結果を確認し、経験を次の判断に生かします。',
          ],
        ].map(([a, b, c]) => (
          <article key={a}>
            <span>{a}</span>
            <h3>{b}</h3>
            <p>{c}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function Diagram() {
  return (
    <figure
      className="flow-visual"
      aria-label="センサー、ゲートウェイ、診断、保全をつなぐ構成図"
    >
      <div className="flow-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="visual-caption">
        <span className="signal-dot" />
        設備の状態を、保全の判断へ。<span>LinkedTi</span>
      </div>
      <svg
        className="flow-lines"
        viewBox="0 0 620 520"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M85 165H180L310 260L450 120M85 370H170L310 260L485 365M450 120H520V365H485"
          stroke="#5892ff"
          strokeWidth="1.5"
        />
      </svg>
      {[
        ['sensor', 'Aura', '現場の信号'],
        ['edge', 'Conflux', 'PLC / DCS'],
        ['software', 'Euda', '状態監視・診断'],
        ['agent', 'Agent', '保全業務の支援'],
      ].map(([id, name, desc], i) => {
        const Icon = products[i].Icon;
        return (
          <div className={`flow-node node-${id}`} key={id}>
            <Icon />
            <div>
              <b>{name}</b>
              <span>{desc}</span>
            </div>
          </div>
        );
      })}
      <div className="flow-core">
        <div className="core-mark">
          <Mark />
        </div>
        <Wordmark />
        <span>設備の状態を見える化</span>
      </div>
      <div className="visual-foot">
        <span>計測 → 理解 → 行動</span>
        <span>システム構成イメージ</span>
      </div>
    </figure>
  );
}
function Inquiry() {
  const [status, setStatus] = useState('');
  const [draft, setDraft] = useState('');
  const [mailUrl, setMailUrl] = useState('');
  function prepare(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    const name = value('name');
    const company = value('company');
    const email = value('email');
    const message = value('message');
    if (!name || !company || !email || !message) {
      setStatus('各項目をご入力ください。');
      return;
    }
    const body = `会社名：${company}\nお名前：${name}\nメール：${email}\n\nご相談内容：\n${message}`;
    setDraft(body);
    setMailUrl(
      `mailto:sales@linkedti.com?subject=${encodeURIComponent('設備監視・予知保全に関するお問い合わせ')}&body=${encodeURIComponent(body)}`,
    );
    setStatus(
      'メールの下書きを作成しました。内容をご確認のうえ、メールアプリから送信してください。',
    );
  }
  return (
    <form className="ja-inquiry" onSubmit={prepare}>
      <h2>設備や課題をお聞かせください。</h2>
      <p>
        このフォームはメールの下書きを作成します。自動送信やサーバーへの保存は行いません。
      </p>
      <label>
        会社名
        <input name="company" autoComplete="organization" required />
      </label>
      <label>
        お名前
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        メールアドレス
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        ご相談内容
        <textarea
          name="message"
          rows={6}
          required
          placeholder="対象設備、現在の課題、PLC／DCS の構成など"
        />
      </label>
      <button className="button primary" type="submit">
        メールの下書きを作成
      </button>
      <output aria-live="polite">{status}</output>
      {draft && (
        <div className="ja-mail-draft">
          <label>
            下書き
            <textarea readOnly rows={8} value={draft} />
          </label>
          <a className="button primary" href={mailUrl}>
            メールアプリを開く
          </a>
          <button
            className="button"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(draft);
                setStatus('本文をコピーしました。');
              } catch {
                setStatus(
                  'コピーできませんでした。上の本文を選択してコピーしてください。',
                );
              }
            }}
          >
            本文をコピー
          </button>
        </div>
      )}
    </form>
  );
}
function About() {
  return (
    <>
      <Intro
        title="つながりを起点に、信頼性を追求する。"
        body="安徽交泰智能技术有限公司（交泰智能 / LinkedTi）は、産業設備の状態監視、故障診断、予知保全に取り組んでいます。設備を使用する企業、システムインテグレーター、設備メーカーに、ハードウェア・ソフトウェアと技術支援を提供します。"
      />
      <section className="wrap about-story">
        <div className="brand-statement">
          <Mark />
          <Wordmark />
        </div>
        <div>
          <p className="eyebrow">社名に込めた思い</p>
          <h2>設備をつなぎ、知見を蓄える。</h2>
          <p>
            「交泰」は『易経』の泰卦に由来し、天地が交わり、万物が通じ合う姿を表します。「交」は交流とつながり、「泰」は安定と調和への願いです。私たちは、情報が流れ、協働が生まれることに、つながりの価値を見いだしています。
          </p>
          <p>
            北京の故宮で乾清宮と坤寧宮の間に位置する交泰殿にも、同じ意味が込められています。この考えを産業の現場へと広げ、設備、データ、診断、保全の行動を結び付けます。
          </p>
          <p>
            LinkedTi という名前は、LinkedIn
            が表す人と人のつながりから着想を得ています。Linked
            は設備間のつながりを、Ti
            はチタンの元素記号として、強さ・安定性・信頼できる品質への姿勢を表しています。
          </p>
          <p className="story-source">
            <a
              href="https://www.dpm.org.cn/explore/building/236467.html"
              target="_blank"
              rel="noreferrer"
            >
              故宮博物院：交泰殿
            </a>
          </p>
        </div>
      </section>
      <section className="wrap identity-evolution">
        <p className="eyebrow">ブランドの歩み</p>
        <h2>ロゴは新しく。交泰智能は、これからも。</h2>
        <p className="identity-intro">
          従来の青色と円形の輪郭を受け継ぎ、図形と社名の配置を見直しました。設備の接続と協働を、より明確な形で表現しています。
        </p>
        <div className="identity-comparison">
          <figure>
            <div className="identity-logo-surface">
              <Image
                unoptimized
                src="/brand/original.png"
                width={328}
                height={92}
                alt="従来の交泰智能ロゴ"
              />
            </div>
            <figcaption>旧ロゴ：従来の製品資料・会社案内に使用</figcaption>
          </figure>
          <figure>
            <div className="identity-logo-surface">
              <div className="brand">
                <Mark />
                <Wordmark />
              </div>
            </div>
            <figcaption>新ロゴ：ブランドを継承したデザイン</figcaption>
          </figure>
        </div>
        <p className="identity-continuity">
          新旧どちらのロゴも、安徽交泰智能技术有限公司（交泰智能 /
          LinkedTi）を表します。従来の会社案内や製品資料に掲載されたロゴも、当社のものです。今回の変更はブランドデザインの更新であり、会社や法人の変更ではありません。
        </p>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <h2>
            技術の積み重ねで、
            <br />
            長期的な信頼を。
          </h2>
        </div>
        <div className="proof-grid">
          <article>
            <span>2024</span>
            <h3>中国のハイテク企業認定</h3>
            <p>
              2024年に認定を取得。設備監視・診断技術の研究開発に継続して取り組んでいます。
            </p>
          </article>
          <article>
            <Cpu />
            <h3>ソフトウェア開発</h3>
            <p>
              設備監視関連ソフトウェアの著作権登録を有し、データ分析、診断、保全業務を結び付けています。
            </p>
          </article>
          <article>
            <Network />
            <h3>産業オートメーションとの連携</h3>
            <p>
              Siemens PLC／DCS とのソリューション統合、Phoenix Contact PLCnext
              との研究開発連携を進めています。
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
export default function JapaneseSite({ page }: { page: PageKey }) {
  useEffect(() => {
    document.documentElement.lang = 'ja';
  }, []);
  const path = page === 'home' ? '' : '/' + page;
  return (
    <div lang="ja" className="japanese-site">
      <a href="#main" className="skip-link">
        本文へ移動
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href={href()} aria-label="LinkedTi ホーム">
            <Mark />
            <Wordmark />
          </a>
          <nav className="desktop-nav" aria-label="メインナビゲーション">
            {nav.map(([p, label]) => (
              <a
                key={p}
                href={href(p)}
                aria-current={page === p ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="language" href={path || '/'} lang="zh-CN">
              中文
            </a>
            <a className="language" href={'/en' + path} lang="en">
              EN
            </a>
            <a className="header-cta" href={href('contact')}>
              お問い合わせ
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <nav className="mobile-nav" aria-label="モバイルナビゲーション">
          {nav.map(([p, label]) => (
            <a
              key={p}
              href={href(p)}
              aria-current={page === p ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        {page === 'home' && (
          <>
            <section className="hero wrap">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span />
                  産業設備の状態監視・故障診断・予知保全
                </div>
                <h1 className="brand-promise">
                  管理する手間を増やさず、
                  <br />
                  <em>現場の仕事をひとつ減らす。</em>
                </h1>
                <p>
                  設備の状態監視を、既存のオートメーションに。設備の故障メカニズムと
                  AI
                  を組み合わせ、異常の早期発見と原因調査を支援します。保全を、繰り返しの調査から計画的な対応へ。
                </p>
                <div className="actions">
                  <a className="button primary" href={href('products')}>
                    製品・技術を見る
                    <ArrowUpRight size={19} />
                  </a>
                  <a className="text-link" href={href('contact')}>
                    技術相談
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                <div className="hero-notes">
                  <span>PLC / DCS</span>
                  <span>故障メカニズム × AI</span>
                  <span>診断から現場確認へ</span>
                </div>
              </div>
              <Diagram />
            </section>
            <div className="principle-bar">
              <div className="wrap">
                <span>現場を起点に、設備と知見をつなぐ。</span>
                <p>Aura → Conflux → Euda → Agent</p>
              </div>
            </div>
            <section className="section wrap">
              <div className="section-heading">
                <h2>
                  現場に合わせて組み合わせる、
                  <br />
                  4つの技術。
                </h2>
                <p>
                  センサー、ゲートウェイ、ソフトウェア、AI
                  を既存の設備と保全業務に合わせて構成します。
                </p>
              </div>
              <ProductCards />
            </section>
            <Integration />
            <section className="software-section">
              <div className="wrap software-layout">
                <div>
                  <p className="eyebrow">Euda / 設備状態の可視化</p>
                  <h2>
                    変化を捉え、
                    <br />
                    判断の根拠へ。
                  </h2>
                  <p>
                    設備状態、トレンド、診断情報を一つの画面で確認。現場確認と保全履歴を結び付け、経験を蓄積します。
                  </p>
                  <a className="text-link" href={href('products') + '#euda'}>
                    ソフトウェアを見る
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <div>
                  <Image
                    unoptimized
                    src="/images/euda-overview.png"
                    width={1267}
                    height={576}
                    alt="Euda の設備監視画面例。画面表示は中国語です。"
                  />
                  <p className="ja-caption">
                    画面例：現行の中国語インターフェース
                  </p>
                </div>
              </div>
            </section>
            <section className="section wrap">
              <div className="section-heading">
                <h2>診断を、現場で確かめる。</h2>
              </div>
              <a className="case-feature" href={href('applications')}>
                <div className="case-marker">
                  <span>Fe</span>
                  <small>鉄鋼</small>
                </div>
                <div>
                  <span className="pill">導入事例</span>
                  <h3>{industries[0][1]}</h3>
                  <p>{industries[0][2]}</p>
                </div>
                <ArrowUpRight className="case-arrow" />
              </a>
            </section>
          </>
        )}
        {page === 'products' && (
          <>
            <Intro
              title="計測から診断、保全の行動まで。"
              body="Aura、Conflux、Euda、Agent を組み合わせ、現場の設備、制御システム、保全体制に合わせた構成をご提案します。仕様と対応範囲は個別の要件に応じて確認します。"
            />
            <section className="wrap">
              <ProductCards />
            </section>
            <section className="section wrap ja-product-details">
              {products.map((p) => (
                <article id={p.id} key={p.id}>
                  <p className="eyebrow">{p.name}</p>
                  <h2>{p.title}</h2>
                  <p>{p.details}</p>
                  {p.id === 'euda' && (
                    <>
                      <Image
                        unoptimized
                        src="/images/euda-workspace.png"
                        width={1268}
                        height={647}
                        alt="Euda の監視ワークスペース画面例（中国語表示）"
                      />
                      <p className="ja-caption">
                        画面例は中国語版です。提供言語や運用要件については個別にご相談ください。
                      </p>
                    </>
                  )}
                  <a href={href('contact')} className="text-link">
                    この製品について相談する
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              ))}
            </section>
            <Integration />
          </>
        )}
        {page === 'applications' && (
          <>
            <Intro
              title="現場ごとの課題に、具体的な判断を。"
              body="重要設備の状態変化を捉え、監視、診断、保全計画をつなぎます。鉄鋼は実際の導入事例、その他は各分野での活用イメージです。"
            />
            <div className="industry-grid wrap">
              {industries.map(([industry, title, body], i) => (
                <article
                  className={`industry-card ${i === 0 ? 'featured-industry' : ''}`}
                  key={industry}
                >
                  <div className="industry-card-top">
                    <Activity size={28} />
                    <span>{i === 0 ? '導入事例' : '活用イメージ'}</span>
                  </div>
                  <p className="industry-name">{industry}</p>
                  <h2>{title}</h2>
                  <p>{body}</p>
                  {i === 0 && (
                    <p className="case-note">
                      本事例は既存 PLC の機能を補完する構成で、Agent
                      は使用していません。
                    </p>
                  )}
                  <a className="text-link" href={href('contact')}>
                    用途について相談する
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
        {(page === 'about' || page === 'brand') && <About />}
        {page === 'contact' && (
          <>
            <Intro
              title="まずは、現場の課題から。"
              body="対象設備、気になっている現象、既存の制御システムについてお聞かせください。現場に合う監視・診断の方法を、一緒に検討します。"
            />
            <section className="wrap contact-layout">
              <aside className="contact-info">
                <a href="mailto:sales@linkedti.com">
                  <Mail />
                  <small>メール</small>
                  <b>sales@linkedti.com</b>
                </a>
                <a href="tel:+8613951419340">
                  <Phone />
                  <small>電話（中国）</small>
                  <b>+86 139 5141 9340</b>
                </a>
                <div>
                  <MapPin />
                  <p>所在地：中国安徽省合肥市高新区 红宝石R栋</p>
                  <p>会社名：安徽交泰智能技术有限公司</p>
                </div>
              </aside>
              <Inquiry />
            </section>
          </>
        )}
        {page !== 'contact' && (
          <section className="contact-band wrap">
            <div>
              <p className="eyebrow">お問い合わせ</p>
              <h2>重要な設備、一台から。</h2>
            </div>
            <a className="button primary" href={href('contact')}>
              用途・課題を相談する
              <ArrowUpRight size={20} />
            </a>
          </section>
        )}
      </main>
      <footer className="wrap">
        <div className="footer-top">
          <a className="brand" href={href()}>
            <Mark />
            <Wordmark />
          </a>
          <p>{promise}</p>
          <div>
            <a href="mailto:sales@linkedti.com">
              <Mail size={16} />
              sales@linkedti.com
            </a>
            <a href="tel:+8613951419340">
              <Phone size={16} />
              +86 139 5141 9340
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 安徽交泰智能技术有限公司</span>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            皖ICP备2023008887号-2
          </a>
          <span>
            <MapPin size={14} />
            中国安徽省合肥市高新区 红宝石R栋
          </span>
        </div>
      </footer>
    </div>
  );
}
