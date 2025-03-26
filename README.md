<p align="center">
    <a href="https://YouTube.com/@RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/Logo.png" width="150">
    </a>
</p>

<div align="center">
    <p>
        Follow me on social media:
    </p>
    <!-- URL de descarga de íconos tamaño 48px X 48px https://iconos8.es/icons/set/social-media -->
    <a style="text-decoration: none;" href="https://www.facebook.com/RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/Facebook.png" alt="Facebook" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://www.instagram.com/RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/Instagram.png" alt="Instagram" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://www.youtube.com/@RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/YouTube.png" alt="YouTube" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://www.x.com/RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/X.png" alt="X (Twitter)" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://www.linkedin.com/company/andyrubiano" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/LinkedIn.png" alt="LinkedIn" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://www.tiktok.com/@RubianoAndy" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/TikTok.png" alt="TikTok" style="width: 30px; height: auto;">
    </a>
    <a style="text-decoration: none;" href="https://wa.me/573178737226" target="_blank">
        <img src="https://raw.githubusercontent.com/RubianoAndy/App_images/main/WhatsApp.png" alt="WhatsApp" style="width: 30px; height: auto;">
    </a>
</div>

<p align="center">
    &copy; 2025 <a href="https://YouTube.com/@RubianoAndy" target="_blank" class="hover:underline">Andy Rubiano™ - International company</a>. All rights reserved.
</p>

<hr>

# EShopFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5 and updated to [Angular CLI](https://github.com/angular/angular-cli) 
version 19.2.5, [NodeJS](https://nodejs.org/en) version 22.11.0, [NPM](https://nodejs.org/en) version 10.9.0 and [Tailwind CSS](https://tailwindcss.com/) version 4.0.

### Initial install

Once the repository is cloned, go in it and install the initial packages with the following commands:

| Command                                                   | What it does?                            |
| --------------------------------------------------------- | :--------------------------------------- |
| `npm install -g @angular/cli@latest`                      | Install Angular in its latest version    |
| `npm install`                                             | Install node modules dependencies        |
| `npm install -D tailwindcss postcss autoprefixer`         | Install Tailwindcss dependencies         |
| `npx tailwindcss init`                                    | Init Tailwindcss                         |

### Angular project commands

| Command                 | What it does?           |
| ----------------------- | :---------------------- |
| `ng new project-name`   | Create the project      |
| `ng g c component-name` | Create a component      |
| `ng g s service-name`   | Create a service        |
| `ng g cl class-name`    | Create a class          |
| `ng g m module-name`    | Create a module         |
| `ng g p pipe-name`      | Create a pipe           |
| `ng g d directive-name` | Create a directive      |
| `ng g g guard-name`     | Create a guard          |
| `ng g i interface-name` | Create a interface      |
| `ng g e enum-name`      | Create a enum           |
| `ng g environments`     | Create the environments |

### Server commands

| Command    | What it does?                                              | Additional information                                 |
| -----------| :--------------------------------------------------------- | :----------------------------------------------------- |
| `ng help`  | Get more help on the Angular CLI                           | More information in `https://angular.dev/tools/cli`    |
| `ng e2e`   | Execute the end-to-end tests via a platform of your choice |                                                        |
| `ng test`  | Execute the unit tests                                     | Test via via Karma in `https://karma-runner.github.io` |
| `ng build` | Build the project                                          |                                                        |
| `ng serve` | Run the server                                             | Navigate to `http://localhost:4200/`                   |

### How to create a project in Angular?

For documentation purposes, this repository was created as follows:

|  #  | Step                                          | Command or information                        |
| --- | :-------------------------------------------- | :-------------------------------------------- |
| 1-  | Install Node.js without Chocolatey            | https://nodejs.org                            |
| 2-  | Open CMD with a specific path                 | Type CMD in the path and press enter          |
| 3-  | Install Angular CLI                           | `npm install -g @angular/cli@latest`          |
| 4-  | Create the project                            | `ng new project-name`                         |
| 5-  | Select SCSS in stylesheet format              |                                               |
| 6-  | Select no to enable SSR and SSG/Prerendering  |                                               |
| 7-  | Install Tailwind (only steps 1, 2 y 3)        | https://tailwindcss.com/docs/installation     |
| 8-  | Replace in tailwind.config.js                 | Put `content: ["./src/**/*.{html,ts,scss}"],` |
| 9-  | Intall angular/cdk to obtain the screen size  | `npm install @angular/cdk`                    |

### How to update a project in Angular to the latest version?

To update Angular to its latest version, you need to enter the project folder and follow these steps:

|  #  | Step                                                     | Command or information                 |
| --- | :------------------------------------------------------- | :------------------------------------- |
| 1-  | Install Node.js to the latest version without Chocolatey | https://nodejs.org                     |
| 2-  | Check node version                                       | `node -v`                              |
| 3-  | Globally update npm to the latest version (if necessary) | `npm install -g npm@latest`            |
| 4-  | Check npm version                                        | `npm -v`                               |
| 5-  | Globally uninstall the Angular CLI                       | `npm uninstall -g @angular/cli`        |
| 6-  | Globally install the Angular CLI to the latest version   | `npm install -g @angular/cli@latest`   |
| 7-  | Update Angular project to the latest version             | `ng update @angular/core @angular/cli` |
| 8-  | Check Angular project version                            | `ng version`                           |
| 9-  | Run the server                                           | `ng serve`                             |
| 10- | Review the errors and make the correction                |                                        |

⚠️ **Waring**: Other dependencies may need to be updated and code changes may be required to eliminate errors present in this process.

<hr>

<p align="center">
    &copy; 2025 <a href="https://YouTube.com/@RubianoAndy" target="_blank" class="hover:underline">Andy Rubiano™ - International company</a>. All rights reserved.
</p>