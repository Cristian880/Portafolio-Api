# Portfolio API

API REST que sirve el contenido del portafolio (proyectos, experiencia, perfil) y expone un panel de administración autenticado.

## Stack

- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- Autenticación basada en JWT
- Despliegue: Railway

## Endpoints principales

- \`GET /api/projects\` — lista de proyectos públicos
- \`GET /api/experience\` — experiencia profesional
- \`POST /api/admin/login\` — autenticación de administrador
- \`POST /api/admin/projects\` — crear proyecto (protegido)

## Desarrollo local

\`\`\`bash
pnpm install
npx prisma migrate dev
pnpm dev
\`\`\`

## Licencia

MIT