# Challenge Summary

## API (Backend)

### Design Choices
- Built with NestJS for modularity and scalability.
- Used DTOs for request/response validation and Swagger documentation.
- Implemented authentication with JWT and route guards for security.
- Product, user, and payment method logic separated in modules and services.
- File uploads handled with Multer, supporting image validation and storage.
- The system implements Redis caching for performance optimization, with automatic cache invalidation on product modifications. Products are cached for 5-10 minutes depending on the endpoint.
- Used in-memory JSON repositories for data persistence (challenge requirement).

## Frontend

### Design Choices
- Built with React and TypeScript for type safety and component reusability.
- Used functional components and custom hooks for separation of concerns.
- Styled with styled-components for modular and maintainable CSS.
- API communication handled via a dedicated service layer (Axios).
- Product detail page modularized into focused components (gallery, info, policies, etc.).
- Tests written with React Testing Library and Jest for UI and logic validation.
- State management handled locally with hooks, no external state library used.

```tsx
const [quantity, setQuantity] = useState(1);

const selectQuantity = (newQuantity: number) => {
  setQuantity(newQuantity);
};
```
This state is only relevant to the purchase sidebar component and does not need to be shared globally. Managing it locally keeps the code simple and avoids unnecessary complexity.


### Challenges & Solutions


- **Performance Optimization**: JSON file-based storage could become slow with frequent reads for product listings. Implemented Redis caching with intelligent cache invalidation strategies. Cache keys are automatically invalidated when products are created, updated, or deleted, ensuring data consistency while improving response times.

- **Complex Validation for Multipart Requests**: Supporting both JSON and multipart/form-data (for file uploads) required custom DTO transformations and validation logic, especially for nested objects like warranty. I used class-transformer and custom validation decorators to ensure robust validation regardless of input format.

- **Authentication and Security**: Protecting sensitive endpoints and user data required robust authentication. I implemented JWT-based authentication with route guards, and ensured that only product owners can update or delete their products.

- **Development Workflow Orchestration**: Managing multiple services (frontend, backend, redis) with different startup requirements. I created orchestrated npm scripts using concurrently to manage all services from the root level. This includes automated dependency installation and service startup with proper environment configuration.


- **Dynamic Product Detail Rendering**: Product data includes images, features, payment methods, and seller info, all of which can vary in structure. I modularized the product detail page into focused components (gallery, info, policies, etc.) and used TypeScript interfaces to ensure type safety and flexibility.

- **Image Gallery State Management**: Handling image loading, errors, and selection required local state and effect management. I used custom hooks and local state to track the selected image, loading status, and error handling, providing a smooth user experience.

- **Form Data and API Compatibility**: Ensuring the frontend could send both file uploads and JSON fields to the backend required careful construction of FormData objects and API calls. I abstracted API communication into a service layer and wrote utility functions to handle both scenarios seamlessly.

- **Testing for Reliability**: I wrote tests with React Testing Library and Jest to cover component rendering, user interactions, and utility logic, ensuring reliability and maintainability.

- **Performance and Responsiveness**: The UI needed to remain fast and responsive even with large product lists. I optimized rendering with React best practices and ensured that only necessary components re-render on state changes.
