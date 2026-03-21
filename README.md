<h1 align="center">HevanCraft</h1>

<p align="center">
  A minimal, state-driven e-commerce interface built with deliberate simplicity.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML-5-111111?style=flat-square" />
  <img src="https://img.shields.io/badge/CSS-3-111111?style=flat-square" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-111111?style=flat-square" />
  <img src="https://img.shields.io/badge/State-LocalStorage-111111?style=flat-square" />
</p>


---

## Overview

HevanCraft is a frontend e-commerce application that models a complete purchase flow using only browser capabilities.

It focuses on clarity, predictable behavior, and a smooth user journey—without relying on external frameworks or backend systems.

---

## System Flow

Home → Product → Cart → Checkout → Payment → Confirmation  

Each transition is explicit.  
Each state is persisted.  
Nothing is hidden behind abstraction.

---

## 🌐 Live Demo

(Add your deployed link here)  
Example: https://your-site-link.com

---

## 📸 Preview

![Home](assets/preview-home.png)  
![Cart](assets/preview-cart.png)  
![Checkout](assets/preview-checkout.png)

---

## Core Behavior

- Deterministic cart state using Local Storage  
- Immediate UI feedback on every interaction  
- Stateless pages connected through shared storage  
- Linear, uninterrupted checkout flow  
- Clear separation of structure, logic, and state  

---

## Features

- Clean and minimal product browsing  
- Product customization with persistent data  
- Dynamic cart with real-time updates  
- Quantity control within cart  
- Structured checkout with delivery form  
- Order summary with pricing breakdown  
- Multiple payment interface options  
- Order confirmation flow  

---

## Implementation

The system is intentionally framework-free.

- **Structure:** HTML  
- **Presentation:** CSS  
- **Logic:** Vanilla JavaScript  
- **Persistence:** Local Storage  

Small, transparent, and easy to reason about.

---

## Project Structure

HevanCraft/
│
├── home.html  
├── cart.html  
├── payment.html  
├── success.html  
│
├── css/  
│   └── style.css  
│
├── js/  
│   ├── script.js  
│   ├── cart.js  
│   └── payment.js  
│
├── assets/  
│   ├── images/  
│   └── icons/  
│
└── README.md  

---

## Getting Started

git clone https://github.com/your-username/HevanCraft.git  
cd HevanCraft  

Open `home.html` in your browser.

---

## Design Philosophy

- Simplicity over complexity  
- Clear and predictable user flow  
- Minimal UI with focused interactions  
- Functional design over visual noise  

---

## Future Direction

- Authentication system  
- Backend integration (Node.js / Firebase)  
- Payment gateway integration  
- Responsive, mobile-first design  
- Intelligent product recommendations  

---

## Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Open a pull request  

---

## Author

Akash Wakade  
B.Tech CSE (AI) | Web Developer  

---

## License

MIT License  

---

<p align="center">
  Built with attention to detail
</p>