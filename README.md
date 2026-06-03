# Heaven on Earth Kingdom Family Ministries Web Platform

[![GitHub Repository](https://img.shields.io/badge/GitHub-dagiteferi%2Fkingdom_web-blue?style=for-the-badge&logo=github)](https://github.com/dagiteferi/kingdom_web)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Welcome to the digital home of Heaven on Earth Kingdom Family Ministries. This platform serves as a vibrant hub for our community, designed to foster spiritual growth, facilitate outreach, and centralize all ministry activities. It embodies our commitment to seeing "heaven on earth" through faith, love, and service.

## Our Calling: Bringing Heaven to Earth

Our name, "Heaven on Earth Kingdom Family Ministries," is our mission statement. We are a family of believers dedicated to manifesting God's heart in our world, yearning to witness the transformation of individuals, cities, and nations through His divine presence and perfect will.

> "Your kingdom come, your will be done, on earth as it is in heaven."
>
> — Matthew 6:10

This foundational scripture inspires our every endeavor.

**Mission:** To cultivate a kingdom culture within every family by nurturing each member in God's Word, empowering them to embody His will on earth as it is in heaven. We are called to proclaim the Gospel of the Kingdom and equip families to live out their divine purpose, ensuring His will is done in our lives, our city, and our world.

**Vision:** Our ultimate vision is a global movement of believers reflecting the culture of heaven—where love reigns, faith triumphs, truth prevails, and God’s presence is intimately experienced—until the entire earth mirrors His glory.

## Key Features

This platform is meticulously crafted to support and amplify our ministry's impact:

*   **Dynamic Public Website:** A welcoming online space for visitors to explore our history, browse inspiring image and video galleries, stay informed about upcoming events, and discover our diverse ministries.
*   **Interactive Engagement:**
    *   **Prayer Requests:** A dedicated channel for individuals to submit prayer needs, fostering a community of intercession.
    *   **Testimonial Sharing:** A space for members to share powerful stories of God's faithfulness, healing, and provision, inspiring others in their faith journey.
    *   **Partnership Applications:** Streamlined process for individuals and organizations to express interest in financial, volunteer, or material partnerships, enabling collaborative Kingdom work.
*   **Comprehensive Admin Dashboard:** A secure, intuitive Content Management System (CMS) empowering authorized staff to:
    *   Manage and publish **Events**, including recurring schedules and featured highlights.
    *   Oversee and update **Ministries**, detailing their activities, leaders, and impact.
    *   Curate and organize the **Gallery** with images and videos, categorizing them for easy access.
    *   Review, approve, and feature **Testimonials** from the community.
    *   Process and track **Prayer Requests**, offering responses and marking progress.
    *   Manage **Partnership** applications, assigning them to staff and logging interactions.
*   **Bilingual Support:** Fully localized in both **English** and **Amharic**, ensuring accessibility and inclusivity for our diverse community.
*   **Responsive & Engaging User Experience:** Built with modern web technologies to provide a seamless and visually appealing experience across all devices, featuring smooth animations and intuitive navigation.

## How It's Built

This project is structured into two interconnected applications: a robust backend API and a dynamic frontend web interface.

### Backend: Content Management System (CMS)

A powerful and secure Content Management System built with Python, designed to manage all ministry data.

*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
*   **Database:** [PostgreSQL](https://www.postgresql.org/) - A powerful, open-source object-relational database system.
*   **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL Toolkit and Object Relational Mapper that gives developers the full power of SQL.
*   **Authentication:** JSON Web Tokens (JWT) for secure admin access.
*   **File Storage:** [Supabase Storage](https://supabase.com/docs/guides/storage) - For efficient and scalable storage of media assets like images and videos.

### Frontend: Interactive Web Interface

A fast, responsive, and interactive user interface that brings the ministry's content to life.

*   **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) - A modern build tool that provides a faster and leaner development experience for web projects.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React.
*   **Routing:** [React Router](https://reactrouter.com/en/main) - For declarative routing in React applications.
*   **State Management/Data Fetching:** [React Query](https://tanstack.com/query/latest) - For powerful asynchronous state management.
*   **Internationalization:** [i18next](https://www.i18next.com/) - For seamless bilingual support (English and Amharic).

## Getting Started Locally

To set up and run this project on your local machine for development or testing, follow these steps:

### 1. Running the Frontend

Ensure you have Node.js installed on your system.

```bash
cd frontend
npm install
npm run dev
```

Once the development server is active, open your web browser and navigate to `http://localhost:5173`.

### 2. Running the Backend

The backend runs on Python and requires an active PostgreSQL database. For detailed setup instructions, including dependency installation, database configuration, and running migrations, please refer to the dedicated [backend README.md](https://github.com/dagiteferi/kingdom_web/blob/main/backend/README.md) file.

```bash
cd backend
# Follow instructions in backend/README.md to set up and run the server.
```

## Contributing

We welcome contributions from the community! If you're passionate about using your skills to support a ministry and contribute to an open-source project, please consider:

*   **Reporting Bugs:** If you encounter any issues, please open a new issue on our [GitHub repository](https://github.com/dagiteferi/kingdom_web/issues).
*   **Suggesting Features:** Have an idea for an enhancement? Share it by opening a feature request.
*   **Submitting Pull Requests:** Feel free to fork the repository, make your changes, and submit a pull request. Please ensure your code adheres to the existing style and conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact and Support

For any inquiries, feedback, or support, please reach out to us through the contact form on the website or by opening an issue on our [GitHub repository](https://github.com/dagiteferi/kingdom_web). 
