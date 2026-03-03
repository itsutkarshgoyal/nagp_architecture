# Client-Side Architecture Assignment - Insurance Portal (MFEs)

This repository contains a client-side micro-frontend (MFE) implementation of an Insurance Portal with:

- A **Container app** (shell)
- **Policy Dashboard MFE** (lists policies, selects one to pay)
- **Premium Payment MFE** (pays premium, uses a Web Worker)

All apps are built with **React + TypeScript**, **Webpack 5 + Module Federation**, and **Sass (SCSS)**.

## 1. Prerequisites

- Node.js (recommended: 18.x or later)
- npm (comes with Node)

## 2. Install Dependencies

In the project root (`c:\\arch_assignment`), run:

```bash
npm install
```

This installs dependencies shared by all three apps.

## 3. Running the Apps Locally (Development)

You need **three terminals** (or split panes) to run the container and the two MFEs.

### 3.1 Start Policy Dashboard MFE

In the project root:

```bash
npm run start:policies
```

- Serves the **policies MFE** on `http://localhost:3001`

### 3.2 Start Premium Payment MFE

In another terminal at the project root:

```bash
npm run start:payments
```

- Serves the **payments MFE** on `http://localhost:3002`

### 3.3 Start Container App

In a third terminal at the project root:

```bash
npm run start:container
```

- Serves the **container app** on `http://localhost:3100`
- The container dynamically loads the MFEs from the above ports via Module Federation.

Then open your browser at:

```text
http://localhost:3100
```

## 4. Application Flow / Cross-MFE Communication

1. Go to **My Policies** in the container (route `/policies`).  
2. The container loads the **Policy Dashboard MFE**, which reads policies from `localStorage` (seeding mock data if needed).  
3. When you click **Pay Premium** on a policy:
   - The policies MFE calls the callback from the container with the selected policy.
   - The container stores the selected policy in its state and navigates to `/pay`.  
4. On `/pay`, the container loads the **Premium Payment MFE** and passes the `selectedPolicy` as a prop.  
5. The payments MFE:
   - Shows policy details.
   - Lets you enter amount and installments.
   - Uses a **Web Worker** to compute a sample installment schedule.  
   - Marks the payment as successful and updates `localStorage` (`payments` list and policy status to `PAID`).

This demonstrates cross-MFE communication via the container and a Web Worker for heavy client-side computation.

## 5. Building for Production

To build all three apps:

```bash
npm run build:all
```

Individual builds:

```bash
npm run build:container
npm run build:policies
npm run build:payments
```

Each app outputs its production bundle into its own `dist` folder.

## 6. Notes

- All styling is written using **SCSS** files in each app's `src` folder.  
- Data is stored purely in the **browser** using `localStorage` to satisfy the "no backend required" constraint.  
- You can deploy each app separately (e.g., Netlify/Azure) and point the container's `webpack.config.js` `remotes` URLs to the deployed `remoteEntry.js` files.

