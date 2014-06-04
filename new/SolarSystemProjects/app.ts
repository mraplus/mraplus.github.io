/// <reference path="Knockout.d.ts" />
/// <reference path="jQuery.d.ts" />

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
        this.searchText = [name, description, author].join(' ').toLowerCase();
        this.visible = ko.observable<boolean>(true);
    }
}

/** Holds our data */
class ProjectViewModel {
    __this: ProjectViewModel;

    /** Is the sort menu visible? */
    sortVisible: KnockoutObservable<boolean>;

    /** Is the search field visible? */
    searchVisible: KnockoutObservable<boolean>;
    /** The string the user entered for searching */
    searchInput: KnockoutObservable<string>;
    /** The amount of results found */
    searchResultText: KnockoutObservable<string>;
    /** The projects found */
    searchResults: KnockoutObservableArray<Project>;

    /** The array of the projects. Updates the grid on change (i.e. order) */
    projects: KnockoutObservableArray<Project>;

    /** Initializes the ViewModel with the given list of projects*/
    constructor(projects: Project[]) {
        this.__this = this;
        this.projects = ko.observableArray<Project>(projects);

        this.sortVisible = ko.observable<boolean>(false);

        this.searchVisible = ko.observable<boolean>(false);
        this.searchResultText = ko.observable<string>("");
        this.searchResults = ko.observableArray<Project>();

        this.searchInput = ko.observable<string>("");

        // Uses a table to show search results
        this.searchInput.subscribe((value: string) => {
            this.searchResults.removeAll();
            if (value !== "") {
                projects.forEach((project: Project, index: number, array: Project[]) => {
                    if (project.searchText.indexOf(value.toLowerCase()) !== -1) {
                        this.searchResults.push(project);
                    }
                });
            }
        });

        // Filters grid to show search results
        //this.searchInput.subscribe((value: string) => {
        //    if (value === "") {
        //        this.searchResultText("Enter something to search for");
        //        projects.forEach((project: Project, index: number, array: Project[]) => {
        //            array[index].visible(true);
        //        });
        //    }
        //    else {
        //        var resultCount: number = 0;
        //        projects.forEach((project: Project, index: number, array: Project[]) => {
        //            if (project.searchText.indexOf(value.toLowerCase()) === -1) {
        //                array[index].visible(false);
        //            }
        //            else {
        //                array[index].visible(true);
        //                resultCount += 1;
        //            }
        //        });
        //        this.searchResultText(resultCount === 0 ? "No results found" : "Found " + resultCount + " projects");
        //    }
        //});

        this.scrollToProject = (item: Project) => {
            // index is incremented because CSS is NOT 0-based
            var element = $("main > section:nth-child(" + (this.projects.indexOf(item) + 1) + ")");
            $("html, body").animate({
                scrollTop: element.offset().top - $("body > header").height()
            }, function () {
                    element.addClass("scaleOut");
                    element.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                        element.removeClass("scaleOut");
                        element.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
                    });
                });
            this.searchResults.removeAll();
            this.toggleSearch();
        }
    }

    /** Smoothly scrolls the document to the project */
    scrollToProject(item: Project) { }

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
        this.sortVisible(false);

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

interface KnockoutBindingHandlers {
    fadeVisible: {};
}

var model;

function onLoadedJson(data: any) {
    // assign the custom event thing
    ko.bindingHandlers.fadeVisible = {
        init: (element, valueAccessor) => {
            $(element).toggle(ko.unwrap(valueAccessor()));
        },

        update: (element, valueAccessor) => {
            ko.unwrap(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
        }
    }

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
    model = new ProjectViewModel(projects);
    ko.applyBindings(model);
}