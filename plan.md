# PACTLY mobile escrow app

## Goal
Build a polished, mobile-first escrow experience with a warm sunset-orange visual system and three connected views: Dashboard, Send & Lock Funds, and Analytics.

## Experience
- Create a compact app shell optimized for phones, with a centered desktop preview and persistent bottom navigation.
- Dashboard: personal greeting, layered balance cards, four quick actions, and a live escrow activity feed.
- Send & Lock: beneficiary summary, editable large amount, custom number pad, release-trigger selector, and lock confirmation.
- Analytics: total volume, smooth orange area chart with an interactive tooltip, and counterparty contract statuses.
- Add a floating “Simulate PR Merge” control that updates the matching escrow from Locked to Disbursed and confirms it with a toast.

## Visual direction
- Off-white canvas, dark graphite contrast surfaces, vivid sunset orange, translucent glass cards, and generous rounded corners.
- Use a distinctive modern grotesk typeface, tactile controls, subtle depth, and restrained transitions.
- Preserve accessible contrast, focus states, and reduced-motion behavior across mobile and desktop widths.

## Technical details
- Implement with the project’s TanStack React foundation, Tailwind CSS v4 tokens, React state, Recharts, Lucide icons, and Sonner notifications.
- Keep the demo client-side with seeded escrow data; no wallet, blockchain, or live GitHub/Figma integration is included.
- Add unique page metadata, mount notifications globally, and validate the three-view interaction in the running preview.
