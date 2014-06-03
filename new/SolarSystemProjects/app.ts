﻿/// <reference path="knockout.d.ts" />

/** A container for the information associated with each project */
class Project {
    /** Holds all the visible information in one string for searching */
    searchText: string;
    /** Is this project visible? */
    visible: KnockoutObservable<boolean>;

    /**
     * Creates a new Project
     * @param (string) name - The Project name
     * @param (string) url - Link to project
     * @param (string) description - The description of the project shown
     * @param (string) author - The author(s) of the project
     */
    constructor(public name: string, public url: string, public description: string, public author: string) {
        this.searchText = [name, description, author].join(' ');
        this.visible = ko.observable<boolean>(true);
    }
}

/** Holds our data */
class ProjectViewModel {
    /** Is the sort menu visible? */
    sortVisible: KnockoutObservable<boolean>;
    
    /** Is the search field visible? */
    searchVisible: KnockoutObservable<boolean>;
    /** The string the user entered for searching */
    searchInput: KnockoutObservable<string>;
    /** Are there no search results? Used to display a "no matches" message */
    noMatches: KnockoutObservable<boolean>;

    /** The array of the projects. Updates the grid on change (i.e. order) */
    projects: KnockoutObservableArray<Project>;

    /** Initializes the ViewModel with the given list of projects*/
    constructor(projects: Project[]) {
        this.projects = ko.observableArray<Project>(projects);

        this.sortVisible = ko.observable<boolean>(false);
        this.searchVisible = ko.observable<boolean>(false);
        this.noMatches = ko.observable<boolean>(false);

        this.searchInput = ko.observable<string>("");
        this.searchInput.subscribe((value: string) => {
            projects.forEach((project: Project, index: number, array: Project[]) => {
                var visibleCount: number = 0;
                if (project.searchText.toLowerCase().indexOf(value.toLowerCase()) === -1) {
                    array[index].visible(false);
                }
                else {
                    array[index].visible(true);
                    visibleCount += 1;
                }
                if (visibleCount === 0) {
                    this.noMatches(true);
                } else {
                    this.noMatches(false);
                }
            });
        });
    }

    /** Opens (in a new window) the item's link */
    openLink(item: Project) {
        window.open(item.url, "_blank");
    }

    /** Toggles the visiblity of the sort menu */
    toggleSort() {
        // disable all other popup boxes
        this.searchVisible(false); 

        this.sortVisible(!this.sortVisible());
    }

    /** Toggles the visibility of the search box */
    toggleSearch() {
        // disable all other popup boxes
        this.searchVisible(false);

        this.searchVisible(!this.searchVisible());
    }

    /** Sorts the projects (grid is automatically updated) */
    sortProjects(data, event: Event) {
        var sortBy = (<HTMLElement>event.currentTarget).dataset['value'];
        this.projects(this.projects().sort((a: Project, b: Project) => {
            if (a[sortBy] > b[sortBy]) {
                return 1;
            } else if (a[sortBy] < b[sortBy]) {
                return -1
            } else {
                return 0;
            }
        }));
    }
}

function onLoadedJson(data: any) {
    // make a list of all the projects
    var projects: Project[] = [];
    data['feed']['entry'].forEach((item) => {
        projects.push(new Project(
            item['gsx$name']['$t'],
            item['gsx$link']['$t'],
            item['gsx$description']['$t'],
            item['gsx$author']['$t']
        ));
    });

    // apply to HTML
    var model = new ProjectViewModel(projects);
    ko.applyBindings(model);
}