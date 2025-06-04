<div align="center">
	<img src=".github/header.svg" width="100%" height="100%" alt="profile_header">
</div>

![Static Badge](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=nextdotjs&logoColor=%23ffffff)
![Static Badge](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel&logoColor=%23ffffff)
![Static Badge](https://img.shields.io/badge/Supabase-%20?style=flat-square&logo=supabase&color=%23000)

AlgoType.net is a versatile [typing test](https://algotype.net/) **designed for programmers** who want to take their programming speed to the next level. It offers a minimalistic experience to practice typing symbols that don't get enough practice.

![Screenshot](.github/screenshot.png)
![Screenshot](.github/screenshot2.png)
![Screenshot](.github/screenshot3.png)

# ✨ (Intended) Features

- ⌨️ Typing System
    - Robust code token system (syntax-aware typing)
    - Realtime stats like wpm, accuracy, and errors
    - Minimalistic design
- 👾 Gamemodes
    - Files: type entire files - implementations of some large feature (larger)
    - Algorithms: type out popular algorithms - like leetcode solutions (smaller)
    - Syntax Drills: practice certain language features - repeated for loops (micro)
    - Timed: 15s/30s/60s code sprints
- 👤 Account System
    - Track past tests + progress
    - Save language/theme preferences
    - Secured with Supabase
- ➕ And much more!

# 🔨 Development

## 🧱 Project Structure

- Frontend is stored in `src/`
    - Contains all react pages/components
    - Utilities to connect to database + authentication
- Backend is stored in `backend/`
    - Have a sorted directory of files for each gamemode (files/algorithms/syntax)
        - Each gamemode is sorted by language
        - Each gamemode have build step -> generate tokens for that gamemode
            - Tokens contain file information + code tokens
    - Scripts to generate tokens + upload tokens to database

```python
src                             # frontend
├── app                         # entry point
│   └── lessons                 # lesson homepage
│       └── [slug]              # dynamic typing test
├── components                  # reusable components
│   ├── ui                      # ui stuff
│   └── typingtest              # typing test stuff
├── utils                       # utilities
└── lib                         # libraries (database stuff)
    └── supabaseClient.js
```

```python
backend                         # backend
├── data                        # data
│   ├── files                   # large files   (group by language)
│   ├── algorithms              # medium files  (group by language)
│   └── syntax                  # snippet files (group by language)
│       ├── python
│       ├── javascript
│       └── cpp
├── data                        # data
└── scripts                     # build scripts
    ├── generateTokens.js       # generate tokens
    └── uploadToSupabase.js     # upload tokens to db
```

---

<div align="center">Happy coding && typing</div>
