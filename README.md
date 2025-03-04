# 🗳️ Sistema de Votación con Restricción Horaria

Este proyecto es una aplicación web que permite a los usuarios votar por diferentes nombres, con la restricción de que la votación solo está habilitada entre **10:00 AM y 10:00 PM**.

## 📌 Características
- ✔️ Agregar nombres en cualquier momento.
- ✔️ Votar solo dentro del horario permitido (10 AM - 10 PM).
- ✔️ Almacenar los votos en **Firebase Firestore**.
- ✔️ Prevenir múltiples votos con `localStorage`.
- ✔️ Ordenar los nombres por número de votos en tiempo real.
- ✔️ Actualizar la lista automáticamente cada minuto.

## 🚀 Tecnologías Utilizadas
- **HTML5** + **CSS3** 🎨
- **JavaScript (ES6+)** 🛠️
- **Firebase Firestore** 🔥

## 🔧 Instalación y Configuración
1. Clona el repositorio:
   ```sh
   git clone https://github.com/JorgeGarcia105/sistema-votacion.git
   cd sistema-votacion
   ```
2. Configura tu proyecto en Firebase:
   - Ve a [Firebase Console](https://console.firebase.google.com/).
   - Crea un nuevo proyecto y habilita Firestore.
   - Copia tu configuración de Firebase en el archivo `script.js`.

## 📜 Reglas de Firestore
Para permitir la lectura y escritura en Firestore, usa estas reglas de seguridad en `Firestore Rules`:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /nombres/{nombre} {
      allow read, write;
    }
  }
}
```
⚠️ **Nota:** Estas reglas son abiertas. Se recomienda personalizar la seguridad en producción.

## 🖥️ Uso
1. **Abrir la página web.**
2. **Agregar un nombre** (sin restricciones de horario).
3. **Votar** por un nombre (solo entre 10 AM y 10 PM).
4. **La lista se actualiza automáticamente cada minuto.**

Si intentas votar fuera del horario permitido, verás un mensaje de restricción.

## 📷 Capturas de Pantalla
✅ *Pendiente de agregar imágenes de la interfaz.*

## 👨‍💻 Autor
**Jorge Iván García Torres**  
📌 [GitHub](https://github.com/JorgeGarcia105)  
📌 [LinkedIn](https://www.linkedin.com/in/JorgeGarcia105)

## 📄 Licencia
Este proyecto está bajo la licencia **MIT**. ¡Siéntete libre de modificarlo y mejorarlo! 🎉

---
🔹 **¿Tienes sugerencias o mejoras?** ¡Acepto PRs y feedbacks! 😃🚀

