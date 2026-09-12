# Birthday Bliss

Build a cute, secure, and professional Birthday Reminder web application with blue and purple tones, tulip flower artwork, and interactive sound effects. Follow these exact specifications:

1. Visual Theme & Audio:

• Color Palette: Soft blue and rich purple gradients with clean, pastel accents.

• Decorative Elements: Cute, aesthetic tulip flower illustrations and graphics thoughtfully placed around the page borders and cards.

• Interactive Sound Effects: Add crisp, pleasant button click sound effects (using the Web Audio API) across all interactive elements and buttons.

• Professional Layout: Modern, clean typography and responsive design for mobile and desktop.

2. Navigation & Pre-Login Experience:

• Header Navigation: Tabs for Home, About Us, and Login / Sign Up.

• Pre-Login Instructions Section: Before logging in, show a clear, visually appealing step-by-step guide explaining how the app works (how to set up your birthday, enable daily 6:00 AM push notifications, and track countdowns).

• About Us Page: A professional and heartwarming page detailing the mission of helping people never miss or forget a special birthday moment.

3. Sign-Up & Login Form:

• Fields Required: 

  - First Name

  - Last Name

  - Birthday (Date Picker)

  - Email & Password

• Security & Safety: Secure user authentication connected to Supabase Auth with Row-Level Security (RLS) enabled so user data stays completely safe, encrypted, and private.

4. Interactive "Cute Maid" Assistant:

• Avatar/Character: A cute maid character element featured on the user's dashboard.

• Speech & Voice Guidance: When clicked, use the browser's Web Speech API (window.speechSynthesis with a gentle, polite tone) to speak out loud.

• Personalization: The maid must greet and address the user by their First Name (e.g., "Welcome back, [First Name]! I am here to assist you with your birthday countdown today.").

• Interactive Guidance: Speech bubbles/dialogue boxes offering helpful tips on how to enable daily push notifications and view remaining days.

5. User Dashboard (Post-Login):

• Live Countdown: Interactive timer displaying Days, Hours, Minutes, and Seconds remaining until the user's next birthday. Includes celebratory confetti animations and sound effects on the actual birthday.

• 6:00 AM Daily Push Notifications: Add an interactive button allowing users to request Web Push Notification permissions. Set up the logic to trigger daily browser alerts at 6:00 AM local time displaying remaining days until their birthday.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a753370-122c-4ca9-ac6b-14a8c5066006).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
