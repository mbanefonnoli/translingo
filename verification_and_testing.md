# Translingo Verification & Testing Guide

This document provides a structured approach to verify the functionality and quality of the Translingo Real-time Audio Translation application.

## 1. Environment Requirements
- **Browser**: Google Chrome or Microsoft Edge (versions with Web Speech API support).
- **Hardware**: Functional microphone and speakers/headphones.
- **Permissions**: Grant microphone access when prompted by the browser.
- **Connection**: Active internet connection (required for the Translation API).

---

## 2. Technical Verification (Console Checks)
Before performing manual tests, open the browser console (`F12` or `Ctrl+Shift+I`) and verify:
- [x] No red error messages on page load.
- [x] "Translingo Logic Loaded" or similar initialization logs are visible.
- [x] **Verified**: IDs in `index.html` match the selectors in `app.js`.

---

## 3. Manual Test Cases

### TC-01: User Interface Layout
- **Procedure**: Open `index.html` in a supported browser.
- **Expected**: 
    - [ ] Logo and "Translingo" title are visible.
    - [ ] Two language selectors (Person A and Person B) are present.
    - [ ] "Start Conversation" and "Stop Session" buttons are visible.
    - [ ] Transcript areas for both Person A and Person B are initialized with "...".

### TC-02: Language Selection & Swapping
- **Procedure**: Change selection for Person A and Person B. Click the "↔" icon.
- **Expected**: 
    - [ ] Dropdowns show list of supported languages.
    - [ ] Clicking "↔" swaps the selected values between the two dropdowns.

### TC-03: Speech Recognition (Transcription)
- **Procedure**: Click "Start Conversation". Grant mic permission. Speak a clear sentence.
- **Expected**: 
    - [ ] Pulse animation appears under the active speaker's name.
    - [ ] "Original" text area updates with live transcription as you speak.
    - [ ] Final transcript appears in black text after a pause.

### TC-04: Real-time Translation
- **Procedure**: Ensure two different languages are selected. Speak a sentence.
- **Expected**: 
    - [ ] After transcription, "Translated" area shows "Translating...".
    - [ ] Correct translation appears within 1-3 seconds.

### TC-05: Speech Synthesis (Audio)
- **Procedure**: After a translation appears, listen for audio output.
- **Expected**: 
    - [ ] The app speaks the translated text automatically.
    - [ ] Changing "Volume" slider or "Speech Speed" affects subsequent audio output.

---

## 4. Edge Case Testing
- [ ] **No Microphone**: Deny mic access. Verify that an "Error: Microphone access denied" message appears.
- [ ] **Offline Mode**: Turn off internet. Verify that transcription works but translation shows a failure message.
- [ ] **Ambient Noise**: Test in a noisy environment to check transcription accuracy.
- [ ] **Rapid Speech**: Speak quickly to see how the "interim transcription" handles the flow.

---

## 5. Verification Checklist (Post-Implementation)
- [x] `verification_and_testing.md` created.
- [x] Test cases validated against current code state.
- [x] Fixes for ID mismatches applied.
- [x] **Deep Logic Verification**: Full transcription -> translation -> synthesis pipeline verified via simulated browser events.
