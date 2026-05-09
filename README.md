# Gym Tracker

Aplicativo local-first para registrar treinos de musculação, acompanhar cargas, repetições e histórico de evolução.

O projeto nasceu de uma necessidade simples: parar de esquecer quanto peso foi usado no último treino.

## 📱 Sobre o projeto

O **Gym Tracker** permite:

- Cadastrar dias de treino por dia da semana
- Adicionar exercícios para cada dia
- Registrar treinos realizados com carga e repetições
- Consultar últimos treinos
- Buscar os últimos treinos por dia da semana
- Editar e excluir treinos registrados
- Editar e excluir dias de treino
- Usar o app de forma local, sem depender de backend

## 🧱 Stack utilizada

- React
- TypeScript
- Vite
- Bootstrap
- Bootstrap Icons
- Capacitor
- Dexie.js
- IndexedDB

## 💾 Persistência local

O app utiliza **Dexie.js** sobre **IndexedDB** para armazenar os dados localmente no navegador/WebView.

Isso permite que o app funcione sem backend e mantenha os dados salvos no dispositivo.

Estrutura principal dos dados:

- `trainingDays`: planos de treino por dia da semana
- `workoutSessions`: treinos registrados com exercícios, séries, cargas e repetições