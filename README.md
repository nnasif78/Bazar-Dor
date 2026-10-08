# বাজার দর · BazarDor

**আজকের বাজারের দাম এক নজরে।** BazarDor is a Bengali-language grocery price guide for exploring current prices and price changes for everyday essentials in Bangladesh.

[Open the live app](https://bazar-dor-ten.vercel.app) · [View the source on GitHub](https://github.com/nnasif78/Bazar-Dor)

## Features

1. **Browse everyday prices** — explore current prices for rice, lentils, oil, vegetables, fish, meat, eggs, spices, and more.
2. **Track price movements** — see products whose prices have increased or decreased, with percentage changes.
3. **Explore by category** — browse category pages and sort products by price or price change.
4. **View product details** — open a product page for market-level price information and comparisons.
5. **Create an account** — sign up or sign in with email and password, Google, or GitHub, then manage your profile.

## Technologies

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) and [HeroUI](https://www.heroui.com/)
- [Better Auth](https://www.better-auth.com/) for authentication
- [MongoDB](https://www.mongodb.com/) with the Better Auth MongoDB adapter
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- Product and category data from the BazarDor API
- [Vercel](https://vercel.com/) for deployment

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Authentication requires the MongoDB and OAuth environment variables configured for Better Auth.
