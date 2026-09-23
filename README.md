# PACTLY

### Secure work. Release with proof.

PACTLY is a milestone-based escrow platform designed for secure
cross-border freelance payments. It connects clients and freelancers
through verified digital deliverables, milestone-based payments, and
automated payment release.

## 🚀 Problem

Cross-border freelance work can involve payment delays, lack of trust,
unclear deliverables, and disputes between clients and freelancers.

Traditional payment systems often do not connect payment release
directly with proof of completed digital work.

## 💡 Solution

PACTLY combines escrow-based payments with digital work verification.

Clients can create contracts, divide projects into milestones, and
secure funds through escrow. When the agreed deliverable is verified,
the corresponding milestone payment can be released.

## ✨ Key Features

- 🔐 Milestone-based escrow
- 💰 Secure payment holding and release
- ✅ Digital deliverable verification
- 📋 Contract and milestone management
- 🔗 GitHub / external service integrations
- 🤖 AI-assisted contract creation
- ⚖️ Dispute management
- 📊 Payment and transaction tracking
- 🔔 Activity and status updates
- 🌍 Cross-border freelance workflow

## 🔄 How It Works

1. Client creates a contract.
2. The project is divided into milestones.
3. Funds are secured for the agreed milestones.
4. Freelancer completes the required work.
5. The digital deliverable is verified.
6. PACTLY confirms the milestone completion.
7. The corresponding payment is released.
8. The transaction is recorded in the contract history.

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- CSS

### Backend
- Nitro
- TypeScript

### Database & ORM
- PostgreSQL
- Supabase
- Drizzle ORM

### Development Tools
- Prettier

## 🏗️ Core Architecture

```text
Client
   │
   ▼
PACTLY Platform
   │
   ├── Contracts
   ├── Milestones
   ├── Escrow
   ├── Verification
   ├── AI Assistant
   └── Disputes
          │
          ▼
   Verified Deliverable
          │
          ▼
   Milestone Payment Release