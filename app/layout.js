import "./style.css";

export const metadata = {
  title: "House Mix",
  description: "Все для затишку вашого дому",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}