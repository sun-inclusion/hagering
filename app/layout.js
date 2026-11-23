import './globals.css';

export const metadata = {
  title: 'ハゲリング | SUNミニゲームシリーズ第3弾',
  description: 'ツヤツヤの頭を弾いて邪魔者を吹っ飛ばせ！爽快パロディ物理アクション',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
