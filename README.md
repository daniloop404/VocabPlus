# VocabPlus: Aprende Inglés con IA

VocabPlus es una aplicación móvil para aprender vocabulario inglés de manera divertida y efectiva, utilizando la potencia de la Inteligencia Artificial.

## Descripción

VocabPlus utiliza el modelo Gemini 1.5 Flash para:

* **Generar oraciones:** Crea ejemplos de oraciones utilizando la palabra que estás aprendiendo.
* **Proveer feedback:** Analiza tus oraciones y te ofrece retroalimentación personalizada sobre su gramática y uso.

## Instalación

1. **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/VocabPlus.git
    ```

2. **Instalar dependencias:**

    ```bash
    cd VocabPlus
    npm install
    ```

3. **Crear el archivo .env:**

    Crea un archivo llamado `.env` en la raíz del proyecto y agrega la siguiente línea:

    ```
    GEMINI_API_KEY=tu_api_key
    ```

    Recuerda reemplazar `tu_api_key` con tu API key de Gemini. Puedes obtenerla en https://cloud.google.com/.

4. **Iniciar el proyecto:**

    ```bash
    npx expo start
    ```
