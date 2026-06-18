function AboutPage() {
  return (
    <div>
      <h1>About This Todo App</h1>

      <p>
        This application helps users manage their tasks efficiently through a
        simple and intuitive interface.
      </p>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Create new todo items</li>
          <li>Edit existing todos</li>
          <li>Delete todos</li>
          <li>Mark tasks as complete</li>
          <li>Filter and sort todos</li>
          <li>User authentication and protected routes</li>
        </ul>
      </section>

      <section>
        <h2>Technologies Used</h2>
        <ul>
          <li>React - Component-based UI development</li>
          <li>React Router - Client-side routing and navigation</li>
          <li>Vite - Fast development server and build tool</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;