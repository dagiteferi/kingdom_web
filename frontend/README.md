# Heaven on Earth Kingdom Family Ministries Frontend

A dynamic, responsive, and interactive web interface for the Heaven on Earth Kingdom Family Ministries. This application serves as the primary public-facing platform, allowing users to engage with ministry content, submit prayer requests, share testimonials, and apply for partnerships. It also provides the administrative interface for managing the CMS backend.

## Key Features

*   **Dynamic Public Website:** A welcoming online space for visitors to explore our history, browse inspiring image and video galleries, stay informed about upcoming events, and discover our diverse ministries.
*   **Interactive Engagement:**
    *   **Prayer Requests:** A dedicated channel for individuals to submit prayer needs, fostering a community of intercession.
    *   **Testimonial Sharing:** A space for members to share powerful stories of God's faithfulness, healing, and provision, inspiring others in their faith journey.
    *   **Partnership Applications:** Streamlined process for individuals and organizations to express interest in financial, volunteer, or material partnerships, enabling collaborative Kingdom work.
*   **Comprehensive Admin Dashboard:** Provides a secure, intuitive Content Management System (CMS) interface for authorized staff to manage all aspects of the ministry's digital content, interacting directly with the backend API.
*   **Bilingual Support:** Fully localized in both **English** and **Amharic**, ensuring accessibility and inclusivity for our diverse community.
*   **Responsive & Engaging User Experience:** Built with modern web technologies to provide a seamless and visually appealing experience across all devices, featuring smooth animations and intuitive navigation.

## Technologies Used

This project leverages a modern frontend stack to deliver a high-performance and maintainable application:

*   **Framework:** [React](https://react.dev/) - A declarative, component-based JavaScript library for building user interfaces.
*   **Build Tool:** [Vite](https://vitejs.dev/) - A next-generation frontend tooling that provides a faster and leaner development experience.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React.
*   **Routing:** [React Router](https://reactrouter.com/en/main) - For declarative routing in React applications.
*   **State Management/Data Fetching:** [React Query](https://tanstack.com/query/latest) - For powerful asynchronous state management and data synchronization.
*   **Internationalization:** [i18next](https://www.i18next.com/) - A robust internationalization framework for JavaScript.
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.

## Project Structure

The frontend application is structured for clarity and maintainability:

```
frontend/
├── public/                 # Static assets (images, manifest, robots.txt)
├── src/
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point for React application
│   ├── app/                # Next.js-like routing for pages (e.g., /admin, /testimonials)
│   ├── assets/             # Images and other media assets
│   ├── components/         # Reusable UI components (e.g., Header, Footer, Forms)
│   │   └── ui/             # Shadcn UI components
│   ├── constants/          # Application-wide constants
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization configuration and translations
│   ├── lib/                # Utility functions and configurations
│   ├── middleware/         # Frontend middleware (e.g., security headers)
│   ├── pages/              # Main application pages (e.g., Home, Ministries, Events)
│   ├── services/           # API service integrations (e.g., Axios instance, API calls)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # General utility functions
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Getting Started

Follow these steps to set up and run the Heaven on Earth Frontend on your local machine.

### Prerequisites

Ensure you have the following installed:

*   **Node.js (LTS version recommended)**: Download from [nodejs.org](https://nodejs.org/).
*   **npm** or **yarn** or **bun**: Package manager (npm is usually included with Node.js).

### Installation

1.  **Clone the repository and navigate to the frontend directory:**

    ```bash
    git clone https://github.com/dagiteferi/kingdom_web.git
    cd kingdom_web/frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install or bun install
    ```

3.  **Configure environment variables:**

    Copy the example environment file and populate it with your specific settings. This typically includes the backend API URL.

    ```bash
    cp .env.example .env
    # Open .env in your editor and fill in the required values.
    ```

    **Important `.env` variables:**
    *   `VITE_API_BASE_URL`: The URL of your backend API (e.g., `http://localhost:8000/api/v1`).
    *   `VITE_SUPABASE_URL`: Your Supabase project URL (if direct frontend interaction is needed).
    *   `VITE_SUPABASE_ANON_KEY`: Your Supabase `anon` key.

### Running the Development Server

To start the development server with hot-reloading:

```bash
npm run dev # or yarn dev or bun dev
```

Open your web browser and navigate to `http://localhost:5173` (or the port indicated in your terminal) to view the application.

## Deployment

This frontend application is designed for easy deployment to platforms like Vercel, Netlify, or other static site hosting services. Ensure your environment variables are correctly configured for the production build.

## Contributing

We welcome contributions from the community! If you're passionate about using your skills to support a ministry and contribute to an open-source project, please consider:

*   **Reporting Bugs:** If you encounter any issues, please open a new issue on our [GitHub repository](https://github.com/dagiteferi/kingdom_web/issues).
*   **Suggesting Features:** Have an idea for an enhancement? Share it by opening a feature request.
*   **Submitting Pull Requests:** Feel free to fork the repository, make your changes, and submit a pull request. Please ensure your code adheres to the existing style and conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the root directory for full details.

## Contact and Support

For any inquiries, feedback, or support, please reach out to us through the contact form on the website or by opening an issue on our [GitHub repository](https://github.com/dagiteferi/kingdom_web).

---
_This documentation aims to provide a clear and comprehensive guide for developers and contributors working with the Heaven on Earth Kingdom Family Ministries Frontend._
