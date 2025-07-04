# Contributing to AquaAware 🌊

Thank you for considering contributing to AquaAware! We're building a scalable web platform with a clean and collaborative workflow. This document outlines the standards and guidelines we follow to ensure consistency and quality.

---

## 🛠️ Project Structure

- `main`: Production-ready code  
- `dev`: Integration branch for ongoing development  
- `feat/client/*`: Frontend feature additions (React, HTML/CSS, etc.)  
- `feat/server/*`: Backend feature additions (APIs, logic)  
- `fix/client/*`: Frontend bug fixes  
- `fix/server/*`: Backend bug fixes  
- `docs/*`: Documentation updates  

Always branch out from `dev`, not `main`.

---

## 🧾 Contribution Guidelines

### ✅ Before You Start

1. **Fork** the repository.
2. **Create a feature branch**:
   
   ```
   git checkout -b feat/client/login-ui
   ```
4. Make your changes and commit.
5. Push to your fork:
   
   ```
   git push origin feat/client/login-ui
   ```
7. Create a **Pull Request to `dev`** with a clear title and description.

---

## ✍️ Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard:

```
<type>(scope): short description
```

### Types

* `feat`: New feature
* `fix`: Bug fix
* `docs`: Documentation only changes
* `style`: Code style or formatting changes
* `refactor`: Code change that doesn’t fix a bug or add a feature
* `test`: Adding or updating tests
* `chore`: Other changes that don’t modify src or test files

### Examples

```bash
feat(client): add responsive navbar
fix(server): resolve auth token expiry issue
docs: update API usage in README
```

---

## 🔀 Pull Request Guidelines

* Target the `dev` branch.
* Keep PRs **small and focused**.
* Use **draft PRs** for work in progress.
* Add screenshots or logs if applicable.
* Reference issues in PRs, e.g. `Closes #12`.

---

## 🧪 Code Style & Standards

* Use Prettier/ESLint for frontend formatting.
* Use meaningful variable/function names.
* Prefer `async/await` for async operations.
* Keep code modular and clean.

---

## ✅ Checklist Before Submitting

* [ ] Code compiles and runs without errors.
* [ ] All tests pass (if applicable).
* [ ] Code is formatted/linted properly.
* [ ] Branch is up to date with `dev`.
* [ ] PR includes a clear and descriptive message.

---

## 🧑‍🤝‍🧑 Code of Conduct

We follow a [Code of Conduct](./CODE_OF_CONDUCT.md) that ensures a respectful, welcoming, and inclusive environment for all contributors.

---

Happy contributing! 💧
— Abhishek Mohanty