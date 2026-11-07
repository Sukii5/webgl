# PanoSphere Studio redesign

This archive contains the redesigned source files for the existing Vite + React + TypeScript project.

## Apply the redesign

1. Make a backup of your current project.
2. Copy the contents of this folder into your existing `webgl` project, allowing these files to replace the matching files:
   - `src/App.tsx`
   - `src/index.css`
   - `index.html`
3. Keep your existing `src/main.tsx`, `package.json`, `package-lock.json`, Vite and Tailwind configuration.
4. Open a terminal in the project folder and run:

   ```bash
   npm install
   npm run dev
   ```

5. When it looks right locally, run `npm run build` and deploy the project to Vercel.

## Included

- Warm ivory architectural visual design and responsive layout.
- Interactive Three.js / React Three Fiber apartment cutaway with furniture, materials, lighting and orbit controls.
- 3D / top-down floor-plan camera modes.
- Property details and selectable residence data.
- Viewing request modal.

## Notes

The apartment is generated procedurally in Three.js; no original CAD/BIM or reference-video 3D model was included in the supplied project. This is a detailed editable starting model, not the exact proprietary geometry or imagery from the video. The supplied apartment prices and sizes are retained from your original `App.tsx` data and displayed in USD.
