# AGENTS.md

This document is the project's coding and architecture guide. Follow these conventions when making changes, while giving priority to established patterns in the existing codebase as described below.

## 1. Project Overview

### Project Overview

This project is a Next.js application using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- Vercel
- Zod for validation

Follow the conventions and architectural rules defined in this document.

The primary goals are:

- maintainability
- clear separation of responsibilities
- type safety
- reusable components
- predictable data flow
- minimal duplication
- secure database access
- small and focused changes
- consistency across the codebase

Do not introduce architectural changes unless they are necessary for the requested task.

---

## 2. Project Structure

### Project Structure

The project follows a feature-oriented architecture while keeping Next.js routing inside `app/`.

Recommended structure example:

```text
src/
├── app/
│   ├── api/
│   │   ├── <resource>/
│   │   │   └── route.ts
│   │   └── ...
│   │
│   ├── auth/
│   │   └── ...
│   │
│   ├── <page>/
│   │   └── page.tsx
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── <feature>/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types.ts
│   │   └── constants.ts
│   └── ...
│
├── contexts/
│   ├── <ContextName>Context.tsx
│   └── ...
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── <topic>/
│
├── hooks/
│
├── lib/
│   ├── prisma.ts
│   ├── ...
│
├── types/
│
└── ...
```

The exact structure may differ depending on the existing project. Do not reorganize the project unless explicitly requested or clearly necessary.

---

### Assets

Static assets should be organized under:

```text
assets/
```

Use meaningful categories.

Example:

```text
assets/
├── images/
├── icons/
├── logos/
├── configurator/
├── products/
└── ...
```

Assets may also be grouped by domain/topic when that improves discoverability.

Example:

```text
assets/
├── products/
│   ├── product-a/
│   └── product-b/
├── logos/
└── icons/
```

Use descriptive filenames.

Avoid:

```text
image1.png
final2.png
new-final-final.png
```

Prefer:

```text
product-front-view.png
configurator-background.webp
company-logo.svg
```

Do not duplicate the same asset in multiple directories.

---

### Decision Rules

When deciding where the new code belongs, use this decision tree:

### Is it a Next.js route?

```text
→ app/
```

### Is it an API endpoint?

```text
→ app/api/
```

### Is it a page?

```text
→ app/<route>/page.tsx
```

### Is it specific to one feature?

```text
→ features/<feature>/
```

### Is it a reusable UI primitive?

```text
→ components/ui/
```

### Is it a global layout?

```text
→ components/layout/
```

### Is it a reusable application-level UI?

```text
→ components/shared/
```

### Is it a shared state across multiple components?

```text
→ contexts/
```

### Is it a reusable React hook?

```text
→ hooks/
```

### Is it infrastructure or external integration?

```text
→ lib/
```

### Is it a static asset?

```text
→ assets/
```

### Is it a globally shared type?

```text
→ types/
```

Always choose the narrowest appropriate scope.

---

## 3. Architecture & Component Organization

### Architectural Principles

Organize code by ownership and responsibility.

Use the following hierarchy:

```text
app/          → routing and Next.js entry points
features/     → domain/application functionality
components/   → globally reusable UI
contexts/     → shared React context and providers
hooks/        → globally reusable React hooks
lib/          → infrastructure and external integrations
types/        → globally shared types
assets/       → static visual assets
```

Always prefer the narrowest appropriate scope.

If something belongs only to one feature, keep it inside that feature.

If something is genuinely shared, promote it to a shared location.

Do not create abstractions for hypothetical future use cases.

---

### Components

## 6.1 Shared Components

Use:

```text
components/ui/
```

for generic reusable UI primitives.

Examples:

```text
Button.tsx
Input.tsx
Modal.tsx
Dropdown.tsx
Tabs.tsx
Card.tsx
```

Use:

```text
components/layout/
```

for application-wide layout components.

Examples:

```text
Header.tsx
Footer.tsx
Sidebar.tsx
Navigation.tsx
```

Use:

```text
components/shared/
```

for reusable application-level components that are not low-level UI primitives.

Examples:

```text
EmptyState.tsx
LoadingState.tsx
ErrorState.tsx
```

---

### Feature Components

Feature-specific components belong inside:

```text
features/<feature>/components/
```

Example:

```text
features/configurator/components/ProductPreview.tsx
features/configurator/components/ConfigurationPanel.tsx
features/configurator/components/PriceSummary.tsx
```

Do not place feature-specific components directly inside:

```text
components/
```

unless they are genuinely shared across multiple features.

---

### Avoid Premature Abstraction

Do not create generic components just because two components currently look similar.

First, determine whether they have the same responsibility and behavior.

Prefer:

```text
features/configurator/components/OptionSelector.tsx
```

over creating:

```text
components/UniversalSelector.tsx
```

with dozens of props for hypothetical future scenarios.

Generalize components when:

- they are actually reused
- the abstraction has a clear responsibility
- the API remains simple
- reuse improves maintainability

---

### Component Responsibility

Each component should have a clear responsibility.

Avoid components that simultaneously handle:

- complex UI
- database access
- API communication
- business calculations
- validation
- global state

Separate these responsibilities.

For example:

```text
Component
    ↓
Hook / Action
    ↓
Service / lib
    ↓
Database
```

Do not directly access Prisma from UI components.

---

## 4. Next.js Conventions

### Next.js App Router

Use the Next.js App Router conventions.

### `page.tsx`

Pages should primarily compose existing components and features.

Avoid putting large amounts of business logic directly inside `page.tsx`.

Prefer:

```tsx
export default function ConfiguratorPage() {
  return <Configurator />;
}
```

instead of implementing the entire feature inside the page.

### `layout.tsx`

Use layouts for:

- shared page structure
- global providers
- navigation
- shared UI
- metadata
- application-wide configuration

Do not put feature-specific business logic into the root layout.

---

### Error Boundaries

Use Next.js error handling mechanisms where appropriate.

For route-level UI errors, use:

```text
error.tsx
```

For loading states:

```text
loading.tsx
```

For not-found states:

```text
not-found.tsx
```

Use these mechanisms instead of manually reproducing loading/error handling everywhere.

---

### Data Fetching

Prefer server-side data fetching when possible.

Server Components should fetch data directly from the server-side data layer when appropriate.

Avoid unnecessary client-side fetching for data that does not require interactivity.

Do not fetch your own Next.js API routes from Server Components unless there is a concrete architectural reason.

Prefer direct server-side calls.

---

## 5. React / Client vs Server Components

### Server Components vs Client Components

Prefer Server Components by default.

Use `"use client"` only when client-side functionality is actually required.

Examples include:

- React state
- event handlers
- browser APIs
- effects
- client-only libraries
- interactive UI

Keep the client boundary as low as reasonably possible.

Do not add `"use client"` to a large parent component when only a small child requires client functionality.

Prefer:

```text
Server Component
    ↓
Client Component
```

instead of:

```text
Client Component
    ↓
everything becomes client-side
```

Avoid unnecessary client-side rendering.

---

## 6. Styling & Tailwind

### Tailwind CSS

Use Tailwind CSS for styling.

Prefer utility classes directly in components:

```tsx
<div className="flex items-center gap-4 rounded-lg p-4">
```

Avoid creating custom CSS when Tailwind can express the required styling clearly.
Make every component responsive by default for mobile-first design if there is not specific reason otherwise.

Layout and Positioning

* Prefer Flexbox and CSS Grid for layout and positioning.
* Use flex for one-dimensional layouts, such as rows, columns, navigation bars, and aligned groups of elements.
* Use grid for two-dimensional layouts, such as card collections, dashboards, and structured page sections.
* Avoid position: absolute for primary page layout whenever Flexbox or Grid can achieve the same result.
* Use absolute positioning only when an element genuinely needs to be positioned relative to another element, such as overlays, badges, icons inside inputs, floating controls, or decorative elements.
* Avoid using fixed pixel offsets, negative margins, or arbitrary positioning values as a substitute for proper layout structure.
* Prefer responsive layouts that adapt naturally to different screen sizes.

Use `globals.css` only for:

- global styles
- CSS resets
- CSS variables
- global typography
- styles that genuinely cannot or should not be represented with Tailwind

Do not create a separate CSS file for every component unless there is a concrete reason.

Avoid excessive use of arbitrary Tailwind values such as:

```text
mt-[17px]
w-[438px]
```

when standard Tailwind utilities or design tokens can be used.

Prefer consistent spacing and sizing from the project's design system.

---

### Tailwind Class Management

When conditional classes become complex, use a class utility such as the project's existing `cn()` helper rather than deeply nested string concatenation.

Prefer:

```tsx
className={cn(
  "rounded-lg p-4",
  isActive && "border-primary",
)}
```

over large unreadable template strings.

Do not introduce a new class utility if the project already has one.

---

## 7. State, Contexts & Hooks

### Contexts

Use the `contexts/` directory for React Contexts that provide state or dependencies across multiple components.

Example:

```text
contexts/
├── AuthContext.tsx
├── ConfiguratorContext.tsx
└── ThemeContext.tsx
```

A context should be created when state genuinely needs to be shared across multiple components that are not conveniently connected through props.

Do not use Context as a replacement for normal component props.

Avoid putting unrelated state into one large context.

Prefer focused contexts:

```text
ConfiguratorContext
AuthContext
CartContext
```

over:

```text
AppContext
```

containing the entire application state.

Providers should be placed as low in the component tree as practical.

Do not wrap the entire application with a provider if only one route or feature requires it.

Context files should generally contain:

- context definition
- provider
- context hook

Example:

```tsx
const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // state and provider logic
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);

  if (!context) {
    throw new Error(
      "useConfigurator must be used within ConfiguratorProvider"
    );
  }

  return context;
}
```

---

### Hooks

Globally reusable hooks belong in:

```text
hooks/
```

Feature-specific hooks belong in:

```text
features/<feature>/hooks/
```

Examples:

```text
hooks/useDebounce.ts
hooks/useMediaQuery.ts

features/configurator/hooks/useConfiguration.ts
features/orders/hooks/useOrders.ts
```

Hooks must follow the `useXxx` naming convention.

Do not create hooks simply to wrap trivial one-line operations unless they provide meaningful abstraction or reuse.

---

### React State

Use the simplest appropriate state mechanism.

Prefer:

1. local component state
2. lifted state
3. Context
4. external state management

in that general order.

Do not use Context for state that only one component needs.

Do not introduce global state management without a concrete requirement.

---

## 8. API / Server Actions / Zod

### API Routes

Next.js API routes belong inside:

```text
app/api/
```

Example:

```text
app/api/orders/route.ts
app/api/products/route.ts
app/api/configurations/route.ts
```

Use the appropriate HTTP methods:

```ts
export async function GET() {}

export async function POST() {}

export async function PUT() {}

export async function PATCH() {}

export async function DELETE() {}
```

Keep API routes thin.

An API route should generally handle:

1. authentication/authorization
2. request parsing
3. validation
4. calling application/business logic
5. response formatting
6. error handling

Do not put large business logic directly into `route.ts`.

Prefer extracting complex logic into appropriate `lib/` or feature-specific services.

---

### API Validation

Validate all external input.

Never assume that data from:

- request bodies
- URL parameters
- query parameters
- forms
- external APIs
- cookies
- headers

is valid.

Use Zod for runtime validation.

Example:

```ts
const schema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});

const result = schema.safeParse(body);

if (!result.success) {
  return NextResponse.json(
    { error: "Invalid request data" },
    { status: 400 }
  );
}
```

Never trust client-side validation as the only validation layer.

---

### Zod

Use Zod for runtime validation at system boundaries.

Good locations include:

```text
features/<feature>/schemas/
lib/validation/
```

depending on scope.

Feature-specific schemas should stay with the feature.

Example:

```text
features/orders/schemas/orderSchema.ts
```

Shared schemas may live in:

```text
lib/validation/
```

Prefer deriving TypeScript types from Zod schemas when appropriate:

```ts
const CreateOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
});

type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
```

Do not duplicate the same schema as both a Zod schema and a manually maintained TypeScript interface unless necessary.

---

### Server Actions

Use Server Actions when the operation is naturally an application mutation initiated by the UI.

Examples:

- creating a record
- updating a record
- deleting a record
- submitting a form
- performing authenticated mutations

Server Actions should:

1. validate input
2. authenticate the user
3. authorize the operation
4. execute business logic
5. perform database operations
6. return a predictable result

Never trust arguments passed from the client.

Always validate Server Action input on the server.

Do not expose sensitive information through returned values.

---

### API Routes vs Server Actions

Use Server Actions for UI-driven mutations where appropriate.

Use API routes when:

- an external client needs the endpoint
- a third-party integration needs an HTTP endpoint
- webhooks are required
- the API must be independently consumable
- HTTP semantics are important

Do not create an API route merely to call it from a Server Component when a direct server-side function is more appropriate.

Avoid unnecessary internal HTTP calls.

Prefer:

```text
Server Component
    ↓
server-side function
    ↓
Prisma
```

over:

```text
Server Component
    ↓
internal fetch("/api/...")
    ↓
API route
    ↓
Prisma
```

---

### Error Handling

Errors should be handled intentionally.

Do not silently swallow errors:

```ts
try {
  ...
} catch {
}
```

unless there is a clear reason.

Use appropriate error responses.

Examples:

```text
400 → invalid request
401 → unauthenticated
403 → authenticated but unauthorized
404 → resource not found
409 → conflict
422 → semantically invalid input
500 → unexpected server error
```

Do not expose internal implementation details to clients.

Avoid returning:

```ts
{
  error: error.stack
}
```

or raw database errors.

Return safe, user-facing messages.

Log detailed errors server-side when appropriate.

---

### Authentication and Authorization

Authentication and authorization are separate concerns.

Authentication answers:

```text
Who is the user?
```

Authorization answers:

```text
Is this user allowed to perform this operation?
```

Never rely on the UI to enforce authorization.

Every protected Server Action, API route, or server-side mutation must verify authorization server-side.

Do not assume that hiding a button prevents unauthorized requests.

---

## 9. Prisma / Neon / Database

### Database

Use Prisma as the ORM.

Use Neon PostgreSQL as the database.

Database access must remain server-side.

Never import Prisma into:

- Client Components
- browser-side hooks
- client-side contexts
- client-side utilities

The browser must never receive database credentials.

---

### Prisma Client

Centralize Prisma Client initialization.

Use a shared Prisma instance such as:

```text
lib/prisma.ts
```

Avoid creating multiple Prisma Client instances throughout the application.

Example:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Follow the project's existing Prisma setup if it differs.

Do not modify Prisma initialization without a concrete reason.

---

### Database Access Layer

Do not place complex database queries directly inside React components.

Prefer:

```text
Component
    ↓
Server Action / Route Handler
    ↓
Service / Repository
    ↓
Prisma
```

For simple operations, direct Prisma usage inside a Server Action or Route Handler may be acceptable.

Do not create unnecessary repository abstractions for every single query.

Introduce a service/repository layer when:

- logic is reused
- queries are complex
- business rules need separation
- testing becomes difficult without the abstraction

---

### Prisma Schema

The Prisma schema is the source of truth for database structure.

Typical location:

```text
prisma/schema.prisma
```

Keep models:

- clearly named
- normalized where appropriate
- relationally correct
- indexed where necessary
- constrained where appropriate

Do not add fields or relations without understanding their impact on existing data.

Before modifying the schema, inspect existing relations and usages.

---

### Prisma Migrations

Schema changes must use Prisma migrations.

During local development:

```bash
npx prisma migrate dev --name <descriptive-name>
```

Examples:

```bash
npx prisma migrate dev --name add_order_status
npx prisma migrate dev --name add_product_relation
```

After pulling schema changes or when needed:

```bash
npx prisma generate
```

To inspect the database:

```bash
npx prisma studio
```

To apply existing migrations in production:

```bash
npx prisma migrate deploy
```

Do NOT use:

```bash
prisma db push
```

for production schema changes.

`db push` may be used for controlled local prototyping when appropriate, but migrations are preferred for persistent project changes.

Never manually edit an already-applied migration unless the migration has not been shared/applied and the consequences are fully understood.

Never delete migrations just to make Prisma stop reporting an error.

---

### Database Migration Safety

Before changing the Prisma schema:

1. inspect the current schema
2. inspect existing database usage
3. determine whether existing records are affected
4. determine whether the migration is destructive
5. consider backwards compatibility
6. generate the migration
7. inspect the generated SQL when the change is significant

Be especially careful with:

- column deletion
- column renaming
- required fields
- unique constraints
- foreign keys
- enum changes
- changing nullable fields to required
- changing data types

Never silently perform destructive database operations.

---

### Environment Variables

Never hardcode secrets.

Use environment variables:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
API_KEY
```

Do not commit `.env` files containing secrets.

Only variables intentionally exposed to the browser should use the appropriate public prefix required by the framework.

Never expose:

- database URLs
- private API keys
- authentication secrets
- service credentials

to client-side code.

---

### Neon / Production Database

Treat the production Neon database as persistent and potentially destructive.

Do not run development database commands against production unless explicitly intended.

Production migrations should be applied using the deployment-safe migration workflow.

Use:

```bash
npx prisma migrate deploy
```

for applying committed migrations to production.

Do not use:

```bash
npx prisma migrate reset
```

against production.

Never run destructive commands against production without explicit confirmation.

---

## 10. TypeScript & Naming

### TypeScript

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a documented and unavoidable reason.

Prefer explicit types.

Use inferred types when inference is clear.

Avoid unnecessary type annotations:

```ts
const name: string = "John";
```

when:

```ts
const name = "John";
```

is sufficient.

Use discriminated unions where appropriate.

Prefer type-safe domain models over loosely typed objects.

Do not use TypeScript casts to silence errors without understanding the underlying issue.

Avoid:

```ts
as any
```

and:

```ts
as unknown as SomeType
```

unless absolutely necessary.

---

### Naming Conventions

## Components

Use PascalCase:

```text
ProductPreview.tsx
ConfigurationPanel.tsx
PriceSummary.tsx
```

## Hooks

Use camelCase beginning with `use`:

```text
useConfiguration.ts
useDebounce.ts
```

## Utilities

Use camelCase:

```text
calculatePrice.ts
formatCurrency.ts
validateConfiguration.ts
```

## Contexts

Use PascalCase:

```text
ConfiguratorContext.tsx
AuthContext.tsx
```

## Constants

Use descriptive names.

For exported constants:

```ts
MAX_FILE_SIZE
DEFAULT_PAGE_SIZE
```

## Variables and functions

Use camelCase:

```ts
calculatePrice()
selectedProduct
configurationData
```

Avoid unclear names:

```text
data
thing
obj
temp
foo
```

unless their scope makes the meaning obvious.

---

### Imports and Path Aliases

Prefer configured path aliases.

Example:

```ts
import { Button } from "@/components/ui/Button";
```

instead of:

```ts
import { Button } from "../../../components/ui/Button";
```

Keep imports clean and remove unused imports.

Avoid circular dependencies.

---

### Barrel Files

Do not automatically create `index.ts` barrel files for every directory.

Use barrel files only when they provide meaningful API boundaries or significantly improve imports.

Avoid barrel files that create:

- circular dependencies
- hidden dependencies
- difficult tree-shaking
- confusing import resolution

---

## 11. Git Conventions

### Git Conventions

Keep commits small and focused.

A commit should represent one logical change.

Prefer commit messages such as:

```text
feat: add product configurator
fix: prevent duplicate order creation
refactor: extract configuration validation
chore: update prisma client
docs: update setup instructions
```

Use conventional commit prefixes where the project follows Conventional Commits:

```text
feat:
fix:
refactor:
chore:
docs:
test:
perf:
```

Avoid vague commits:

```text
update
changes
fix stuff
final
```

Do not mix unrelated refactoring with a feature or bug fix.

---

### Git Safety

Never perform destructive Git operations without explicit user intent.

Avoid:

```bash
git reset --hard
git clean -fd
git push --force
```

unless explicitly requested and the consequences are understood.

Do not rewrite shared branch history unnecessarily.

Do not modify unrelated files.

Before committing, inspect:

```bash
git status
git diff
```

---

### Branching

Use feature branches for non-trivial work.

Example:

```text
feature/configurator
feature/order-history
fix/checkout-validation
refactor/component-architecture
```

Keep branches focused on one logical task.

Do not combine unrelated features into one branch.

---
## Testing Philosophy

Tests should verify application behavior and business requirements, not implementation details.

Prefer tests that simulate how a real user interacts with the application.

Use the following testing layers:

```text
Unit Tests
    ↓
Component Tests
    ↓
Integration Tests
    ↓
E2E Tests
```

Use the lowest appropriate testing level for each piece of functionality.

Do not write tests simply to increase code coverage. Tests should provide meaningful confidence that the application behaves correctly.

---

### Testing Stack

Use:

- Jest for unit and test execution
- React Testing Library for React component testing
- `@testing-library/jest-dom` for DOM assertions
- Playwright for end-to-end tests when configured in the project

Follow the versions and configuration already present in the project.

Do not introduce another testing framework if an existing project setup already provides equivalent functionality.

---

### Component Testing

Every component that contains meaningful behavior, interaction, conditional rendering, or business-related presentation should have tests.

Do not require tests for completely trivial presentational wrappers that contain no meaningful logic or behavior.

Examples that should generally have tests:

```text
Button
Modal
Dropdown
Form
ConfigurationPanel
ProductSelector
PriceSummary
OrderForm
```

A component test should verify observable behavior.

Test:

- rendered content
- user interactions
- callbacks
- conditional rendering
- disabled/enabled states
- loading states
- error states
- empty states
- accessibility-relevant behavior
- important edge cases

Example:

```tsx
it("calls the callback when the user clicks the button", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();

  render(<Button onClick={onClick}>Save</Button>);

  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

Prefer semantic queries:

```text
getByRole
getByLabelText
getByText
getByPlaceholderText
```

Avoid relying on implementation details such as:

```text
CSS classes
internal state
component instance
DOM structure
```

Avoid selectors such as:

```tsx
container.querySelector(".some-class")
```

when a semantic query is available.

---

### Component Test File Location

Prefer colocating tests with the component when this matches the existing project structure.

Example:

```text
features/configurator/components/
├── ProductPreview.tsx
├── ProductPreview.test.tsx
├── ConfigurationPanel.tsx
└── ConfigurationPanel.test.tsx
```

For shared components:

```text
components/ui/
├── Button.tsx
├── Button.test.tsx
├── Modal.tsx
└── Modal.test.tsx
```

Keep tests close to the code they test unless the project has an established separate test directory convention.

---

### Test Naming

Use:

```text
<ComponentName>.test.tsx
```

for React components.

Use:

```text
<utilityName>.test.ts
```

for utilities.

Examples:

```text
ProductPreview.test.tsx
ConfigurationPanel.test.tsx
calculatePrice.test.ts
validateConfiguration.test.ts
```

Use descriptive test names.

Prefer:

```text
it("displays an error when the configuration is invalid")
```

over:

```text
it("works")
```

Test names should describe observable behavior.

---

### Testing Utilities

Every non-trivial pure utility or business logic function should have unit tests.

Examples:

```text
calculatePrice()
validateConfiguration()
formatCurrency()
calculateDiscount()
getConfigurationTotal()
```

Test:

- normal cases
- boundary values
- invalid input
- empty values
- null/undefined where applicable
- unexpected combinations
- important business rules

Example:

```text
calculatePrice()

✓ calculates the normal price
✓ applies the correct discount
✓ handles quantity = 1
✓ handles the maximum supported quantity
✓ rejects invalid quantity
✓ handles optional configuration
```

Pure business logic should generally have higher test coverage than simple UI code.

---

### Custom Hook Testing

Test custom hooks when they contain meaningful logic.

Examples:

```text
useConfiguration()
useCart()
useDebounce()
usePagination()
```

Test:

- initial state
- state transitions
- returned values
- callbacks
- side effects
- error behavior
- cleanup behavior

Do not test trivial hooks that merely wrap another hook without adding meaningful behavior.

---

### Context Testing

Contexts should be tested when they contain meaningful state management or business logic.

Test:

- provider initialization
- default state
- state updates
- exposed actions
- derived values
- error behavior
- provider boundary behavior

Example:

```text
ConfiguratorContext

✓ initializes with the default configuration
✓ updates the selected product
✓ updates configuration options
✓ calculates the correct total
✓ throws when the hook is used outside the provider
```

Do not test React Context itself. Test the behavior provided by the context.

---

### Forms

Forms should test the complete user interaction flow.

Test:

- rendering
- field interaction
- validation
- required fields
- invalid values
- submission
- successful submission
- server/API errors
- loading/submitting state
- disabled state
- reset behavior where applicable

Prefer testing forms through user interaction rather than directly calling submit handlers.

---

### API Route Testing

API routes should be tested when they contain meaningful application behavior.

Test:

- valid requests
- invalid requests
- missing required fields
- authentication
- authorization
- not-found cases
- conflict cases
- successful responses
- expected error responses
- malformed input

Verify both:

```text
HTTP status
response body
```

Do not only test that the function executes without throwing.

---

### Server Action Testing

Server Actions should be tested for:

- input validation
- authentication
- authorization
- successful mutations
- validation failures
- permission failures
- expected application errors
- unexpected errors

Example test scenarios:

```text
✓ creates a valid order
✓ rejects invalid order data
✓ rejects unauthenticated users
✓ rejects unauthorized users
✓ returns a predictable error
✓ does not create an order when validation fails
```

Never skip authorization tests for protected mutations.

---

### Database Testing

Do not test Prisma itself.

Test application behavior that depends on the database.

For example, do not write tests whose purpose is simply to verify:

```text
prisma.order.findMany()
```

works.

Instead test:

```text
getUserOrders()
createOrder()
updateOrderStatus()
deleteOrder()
```

and verify their application behavior.

For database-heavy functionality, prefer integration tests using an isolated test database when practical.

Never run tests that modify production data.

Never point destructive integration tests at the production database.

---

### Integration Tests

Use integration tests when multiple application layers need to work together.

Examples:

```text
Server Action
    ↓
Validation
    ↓
Business Logic
    ↓
Prisma
    ↓
Database
```

Integration tests are especially useful for:

- order creation
- configuration persistence
- authentication flows
- complex database operations
- multi-step business rules

Do not mock every dependency in integration tests.

The purpose of an integration test is to verify that real application layers work together.

---

### Mocking

Mock only external dependencies or behavior that should not be executed during the test.

Good candidates:

- external APIs
- payment providers
- email providers
- file storage
- browser APIs
- third-party services

Avoid excessive mocking of your own application code.

Do not mock a function merely because mocking it makes the test easier.

Over-mocking can produce tests that pass while the real application is broken.

---

### Testing Client vs Server Code

Client Components should generally be tested with React Testing Library.

Server-side logic should generally be tested as:

- unit tests
- integration tests
- API tests
- Server Action tests

Do not force server-only functionality into client-side tests.

Do not import server-only modules into Client Components just to make them easier to test.

---

### Loading, Error and Empty States

Every component or feature that has asynchronous behavior should consider testing:

```text
Loading
Success
Empty
Error
```

For example:

```text
ProductList

✓ shows loading state
✓ displays products
✓ displays empty state when no products exist
✓ displays error state when loading fails
```

Do not test only the happy path.

---

### Edge Cases

Tests should cover important edge cases.

Examples:

- empty arrays
- zero values
- maximum values
- missing optional values
- invalid input
- duplicate data
- expired/invalid state
- unauthorized access
- network failures
- database failures

Prioritize edge cases that can cause incorrect data, security problems, or broken user flows.

---

### Accessibility Testing

Use semantic HTML and accessible queries.

Prefer:

```tsx
screen.getByRole("button", { name: "Save" })
```

instead of:

```tsx
screen.getByTestId("save-button")
```

Use `data-testid` only when there is no meaningful semantic query available.

Important interactive elements should have:

- accessible names
- correct roles
- keyboard accessibility
- appropriate labels
- correct disabled states

---

### Test IDs

Do not add `data-testid` by default.

Prefer semantic queries.

Use `data-testid` only when the element cannot reasonably be selected through:

- role
- label
- text
- placeholder
- other user-facing attributes

---

### Test Coverage

Coverage is a signal, not the primary goal.

Prioritize coverage for:

1. business logic
2. authentication and authorization
3. data validation
4. database mutations
5. financial calculations
6. configuration logic
7. critical user flows
8. error handling

Do not add meaningless tests solely to increase the coverage percentage.

---

### Regression Tests

When fixing a bug, add a regression test whenever practical.

The test should reproduce the original failure and verify that the bug remains fixed.

Preferred workflow:

```text
Bug
 ↓
Write failing test
 ↓
Fix implementation
 ↓
Test passes
```

This prevents the same bug from returning later.

---

### Test Before Completion

After implementing a non-trivial change:

```bash
npm test
```

Run the project's configured test command.

For a specific test:

```bash
npx jest <test-file>
```

For watch mode during development:

```bash
npx jest --watch
```

Also run:

```bash
npm run lint
```

and when appropriate:

```bash
npm run build
```

Do not claim that tests pass unless they were actually executed.

---

### E2E Testing

Use Playwright for critical end-to-end user flows when the project is configured for E2E testing.

Examples:

```text
Login
  ↓
Create configuration
  ↓
Add to cart
  ↓
Checkout
  ↓
Create order
```

E2E tests should focus on critical workflows rather than every small UI detail.

Do not replace component/unit tests with E2E tests.

Use E2E tests for confidence that the complete system works together.

---

## Testing Pyramid

Prefer approximately:

```text
        /\
       /  \
      / E2E\
     /------\
    /Integr. \
   /----------\
  / Unit + UI  \
 /--------------\
```

Use many fast unit/component tests, fewer integration tests, and a smaller number of critical E2E tests.

Do not create an application where every behavior is tested only through slow E2E tests.

---

### Definition of Done

A feature is not considered complete until:

- relevant tests exist
- existing tests pass
- new tests pass
- important edge cases are covered
- lint passes
- build passes when appropriate
- no unrelated tests were broken

For bug fixes:

- reproduce the bug
- add a regression test
- fix the bug
- verify the regression test passes

Testing should provide confidence in behavior, not merely increase test count.

---

## 12. Development Workflow

### Development Workflow

Every non-trivial task should follow:

```text
PLAN
  ↓
INSPECT
  ↓
IMPLEMENT
  ↓
TEST
  ↓
REVIEW
```

## Step 1 — PLAN

Before modifying code:

- understand the requested behavior
- identify affected features
- identify relevant existing components
- identify database/API implications
- determine whether existing abstractions can be reused

For larger tasks, write a short implementation plan before coding.

Do not immediately start creating files without understanding the existing architecture.

---

### INSPECT

Before implementing:

- inspect relevant files
- inspect existing components
- inspect related hooks
- inspect contexts
- inspect API routes
- inspect Prisma schema when database-related
- inspect existing validation schemas
- inspect existing utilities

Search the codebase before creating a new abstraction.

The goal is to reuse existing patterns instead of duplicating them.

---

### IMPLEMENT

Implement the smallest clean solution that satisfies the requirement.

Follow existing project conventions.

Do not:

- refactor unrelated code
- rename unrelated files
- change architecture unnecessarily
- introduce dependencies without reason
- create speculative abstractions

Prefer composition over duplication.

---

### TEST

After implementation, verify the affected functionality.

At minimum:

```bash
npm run lint
```

and:

```bash
npm run build
```

when appropriate.

If tests exist:

```bash
npm test
```

or the project's configured test command.

For Prisma-related changes, also verify:

```bash
npx prisma generate
```

and the relevant migration workflow.

Do not claim a feature works without performing appropriate verification.

---

### REVIEW

Before considering the task complete, review the changes.

Check:

### Correctness

- Does the implementation satisfy the requirement?
- Are edge cases handled?
- Are errors handled?

### Architecture

- Is the code in the correct directory?
- Is the component feature-specific or shared?
- Is there unnecessary abstraction?
- Are responsibilities separated?

### Type Safety

- Are there unnecessary `any` types?
- Are unsafe casts present?
- Are inputs validated?

### Security

- Is authorization enforced server-side?
- Are secrets protected?
- Is user input validated?
- Is database access server-side?

### Performance

- Is `"use client"` necessary?
- Are unnecessary requests made?
- Is data fetched server-side where appropriate?
- Are expensive operations repeated unnecessarily?

### Cleanliness

- Are there unused imports?
- Are there dead files?
- Is duplicated logic introduced?
- Are naming conventions followed?

---

### Change Scope

Keep changes proportional to the request.

If the user asks:

> Add a delete button to orders.

Do not simultaneously:

- redesign the order architecture
- migrate all components
- rename unrelated files
- rewrite the database layer
- introduce a new state-management library

unless those changes are required.

Prefer small, reviewable changes.

---

### Existing Code Takes Priority

When working in an existing project, inspect the current implementation before applying these guidelines.

If the project already has an established pattern that differs from these guidelines, preserve the existing pattern unless:

- it causes a concrete problem
- the user explicitly asks for refactoring
- the requested feature requires a different structure

Do not perform large-scale architectural migrations as a side effect of implementing a feature.

---

### Agent Behavior

The coding agent must:

- inspect before modifying
- reuse existing code where possible
- prefer simple solutions
- preserve existing architecture
- validate external input
- protect server-side resources
- keep client boundaries small
- avoid unnecessary dependencies
- avoid unrelated changes
- verify its work
- report important assumptions
- never hide errors
- never silently perform destructive operations

The agent must not:

- invent APIs or database fields without checking the codebase
- create duplicate components
- put feature-specific components into global shared folders without justification
- access Prisma from client-side code
- trust client-side validation
- expose secrets
- use `any` as a shortcut
- introduce global state without justification
- perform destructive database or Git operations without explicit intent
- refactor unrelated parts of the application

---

### Final Principle

When in doubt:

```text
Prefer the simplest solution
        ↓
Keep code close to where it is used
        ↓
Extract only when reuse is real
        ↓
Keep server and client responsibilities separate
        ↓
Validate all external input
        ↓
Protect database and secrets
        ↓
Make small, testable changes
```

The architecture should evolve with the application rather than being over-engineered in advance.
