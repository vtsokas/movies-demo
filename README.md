# 1. How to run

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

## Clone the repository

``` bash 
git clone https://github.com/vtsokas/movies-demo.git 
```

## Install dependencies

```bash
cd movies-demo
npm install
```

## Configure MovieDB api token

If you are provided with an **environment.local.ts** file, include it in /src/app/environment. Otherwise, create it using the proper MovieDB configuration, as shown in environment.development.ts.

## Start development server

To start a local development server, run:

```bash
ng serve --configuration=local
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Test the application

To execute the tests, run

```bash
ng test
```
Every component has been tested at the level of being created. The pages have also been tested alongside the store, simulating action dispatching and ensuring the data flow. The movie service where the different data layers are being accessed and combined is tested extensively.

# 2. Architecture

## Fog architecture

This project implements a simplified **Fog Architecture** pattern by introducing an intermediate layer between the client application and the cloud data source (the MovieDB API). In this setup, the MovieDB API represents the **Cloud Layer** and acts as the primary source of truth for movie data, while the **Fog Layer** is implemented using the browser’s Local Storage. The application interacts with both layers, but all cloud data is processed through the fog layer before being presented to the user.

The fog layer serves multiple purposes, such as supporting offline behavior, reducing direct cloud requests, improving performance through caching, and enriching or masking cloud data. In this project specifically, it is used to decorate and extend the cloud dataset with user-specific state.

Movie data is initially fetched from the MovieDB API. User can then modify, delete, and mark or unmark movies as favourites. These changes are stored locally in the fog layer (Local Storage) rather than being sent back to the cloud. Whenever new data is retrieved from the API, it is merged with the locally stored fog data before being displayed in the UI. In other words, cloud data always passes “through the fog” before reaching the user, ensuring that local modifications enhance the base dataset without altering the original cloud source.

![alt text](public/readme/image.png)

## State Management with NgRx

In addition to the Cloud and Fog layers, this project implements **NgRx Store** as a third data layer within the Angular application. NgRx provides a centralized and reactive state management solution that enables components and services to communicate in a predictable and asynchronous manner.

NgRx introduces a unidirectional data flow pattern. Components dispatch **Actions** to express events or intent. These actions are handled either by **Reducers**, which produce new immutable state based on the current state and the action, or by **Effects**, which manage asynchronous operations such as API calls or side effects. The updated state is then stored in the centralized Store.

Components access and react to state changes using **Selectors**, which provide a clean and efficient way to retrieve specific slices of the application state. This architecture ensures clear separation of concerns, improved maintainability, and predictable state transitions across the application.

![alt text](public/readme/image-1.png)

## Project structure

Our top level folder architecture has been chosen to reflect the ontological priority of the different layers, with the most dependant entity being the Pages. That said, each layer depends on all the others below it. 

```
app/
├── pages/
│   ├── card-page/
│   ├── detail-page/
│   └── favourite-page/
├── components/
│   ├── card-component/
│   ├── casting-component/
│   ├── form-component/
│   ├── gallery-component/
│   └── similar-component/
├── stores/
│   ├── genre/
|   |   ├── genre.actions.ts
|   |   ├── genre.reducer.ts
|   |   ├── genre.effects.ts
|   |   ├── genre.selector.ts
│   └── movie/
|   |   ├── movie.actions.ts
|   |   ├── movie.reducer.ts
|   |   ├── movie.effects.ts
|   |   ├── movie.selector.ts
├── services/
│   ├── genre.service.ts
│   └── movie.service.ts
└── models/
    ├── genre.model.ts
    └── movie.model.ts
```

# 3. Decisions

## Concerning data

### Cloud alongside Fog data

There are three ways to handle data for this demo: 1. Use an actual Cloud API, 2. Use a local DB (or API & DB), 3. Mock data. Also there are two different type of requirements: 1. Handle HTTP failure, 2. Modify data. Additionally, in order to deal with scrolling behaviour and make a meaningful application, we should rely on actual movie data. Given that an actual Cloud API (Movie DB) does not **allow modifications** and other two solutions do not give **access to actual data**, or actual HTTP, we had to come up with a combination of Cloud and Fog as explained above.

### NgRx vs Ngrx Signal

Chose the NgRx Store, despite the fact that NgRx signal is generally suggested for smaller sized applications. The reason was to experiment with a more complicate and demanding architecture, as a demo for bigger applications. Having to deal with diffenent data sources implies the implementation of a more solid structure. Also chosen due to prior experience.

### Favourites on Fog vs Cloud

MovieDB allows to add a movie as a user's favourite, so it was possible to have the Cloud as a source of truth for our favourites. Though, this would generate architectural chaos by breaking the simple rule that is used here: Original data from the Cloud, User specific data from/to the Fog.

## Concerning UI

### Cards list vs Table

Displaying a list of movies is more about the poster than anything else. This said, a table view or a list of wide and short cards would display much white space and small pictures. So a grid with six cards per column was used, to display mainly the picture and secondarily some info and actions.

### Scrolling behaviour

The main concept here is very simple. As movies are loaded, our **Store** keeps the entire list even if the user has navigated to another page. So by monitoring and storing the **current scroll position** and the **last loaded page**, it is possible to restore the exact state of the Movies page. Normally, these two variables should be declared in the MoviesState and be observed from there. Instead, they are kept in SessionStorage, because i wanted the Store to deal only with data. To complete the functionality, these variables are reset each time AppComponent gets initialized.

``` TODO: Have a DataState and a UIState ```

### Performance issues

Having 1. Pictures of relatively high resolution, 2. Several data bindings, 3. Event handling and 4. Many movies in the list, causes the page not to perform smoothly, especially when navigating to it. We could either display a limited amount of movies, and maintain a "window" array (ex. as a signal) that will be changed by a fake scrollbar, or monitor each cards position and not display content if is not currently visivle by the user. The second solution is more naturally reactive, the first would be preferred in really big datasets. The second solution was chosen combined with a skeleton implementation for better UX and because it has less use cases.

### Extend the Movies

A list of favourite movies is after all, a list of movies. So i decided to implement the favourites-page by extending the cards-page component, using the last's html and css and overriding some lifecycle funtions to alter functionality (no scroll behaviour here). I did it to experment with the concept.