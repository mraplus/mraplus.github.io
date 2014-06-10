/// <reference path="lib/Knockout.d.ts" />
/// <reference path="lib/jQuery.d.ts" />


/** A container for the information associated with each project */
class Project {
    /**
     * Creates a new Project
     * @param (string) name - The Project name
     * @param (string) url - Link to project
     * @param (string) description - The description of the project shown
     * @param (string) author - The author(s) of the project
     * @param (string) type - Type of project
     * @param (Date) timestamp - The date this project was added
     */
    constructor(
        public name: string = "",
        public url: string = "",
        public description: string = "",
        public author: string = "",
        public type: string = "",
        public timestamp: Date = new Date()) { }
}

/** Holds our data */
class ProjectViewModel {
    /** Are the credits visible? */
    contactVisible: KnockoutObservable<boolean>;

    /** Is the project visible in a popup? */
    projectPopup: KnockoutObservable<boolean>;
    /** The currently selected project i.e. when "more" is clicked */
    selectedProject: KnockoutObservable<Project>;

    /** Is the sort menu visible? */
    sortVisible: KnockoutObservable<boolean>;
    /** The current sort direction */
    sortDirection: number;
    /** The currently selected sort method */
    sortBy: string;

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

    /** Initializes the ViewModel with everything blank */
    constructor() {
        this.projects = ko.observableArray<Project>();

        this.projectPopup = ko.observable<boolean>(false);
        this.selectedProject = ko.observable<Project>(new Project());

        this.contactVisible = ko.observable<boolean>(false);

        this.sortVisible = ko.observable<boolean>(false);
        this.sortDirection = 1;

        this.searchVisible = ko.observable<boolean>(false);
        this.searchResultText = ko.observable<string>("");
        this.searchResults = ko.observableArray<Project>();

        this.searchInput = ko.observable<string>("");

        // Find search results on input
        this.searchInput.subscribe((value: string) => {
            this.searchResults.removeAll();
            if (value !== "") {
                this.projects().forEach((project: Project) => {
                    var searchString = [project.name, project.description, project.author].join(' ').toLowerCase();
                    if (searchString.indexOf(value.toLowerCase()) !== -1) {
                        this.searchResults.push(project);
                    }
                });
            }
        });

        this.selectedProject.subscribe((item: Project) => {
            // index is incremented because CSS is NOT 0-based
            var element = $("main > section:nth-child(" + (this.projects.indexOf(item) + 1) + ")");
            $("main").animate({
                scrollTop: element.position().top + $("main").scrollTop()
            }, () => {
                    $("#currentProject").css("background-color", element.css("background-color"));
                    this.toggleProjectPopup();
                });

            // reset form
            $("#searchField").val('');
            this.searchInput('');
            this.searchResults.removeAll();
            this.searchVisible(false);
        });
    }

    /** Smoothly scrolls the document to the project. Implemented in constructor because of (this) issues */
    scrollToProject(item: Project) { }

    /** Opens (in a new window) the item's link */
    openLink(item: Project) {
        window.open(item.url, "_blank");
    }

    /** Opens/Closes the project popup */
    toggleProjectPopup() {
        if (this.contactVisible()) {
            this.toggleContact();
        }

        this.projectPopup(!this.projectPopup());
        this.projectPopup() ? $("#fade").fadeIn() : $("#fade").fadeOut();
    }

    /** Toggles visiblity of credits */
    toggleContact() {
        this.contactVisible(!this.contactVisible());
        this.contactVisible() ? $("#fade").fadeIn() : $("#fade").fadeOut();
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
        $(".project:last-child").css("margin-bottom", 0); // reset margin
        $(".button[data-value='" + this.sortBy + "']").removeClass('ascending descending selected'); // reset button

        var element = $(event.currentTarget).addClass('selected');
        var newSort = element.data("value");
        if (newSort === this.sortBy) {
            this.sortDirection *= -1;
        }
        else {
            this.sortBy = newSort;
            this.sortDirection = 1;
        }
        if (this.sortDirection === 1) {
            element.addClass('descending');
        }
        else {
            element.addClass('ascending');
        }
        this.projects(this.projects().sort((a: Project, b: Project) => {
            if (a[this.sortBy] > b[this.sortBy]) {
                return this.sortDirection;
            } else if (a[this.sortBy] < b[this.sortBy]) {
                return -(this.sortDirection);
            } else {
                return 0;
            }
        }));
        setHeader();
    }
}

interface KnockoutBindingHandlers {
    fadeVisible: {};
}

// allows inspecting of VM from Console
var model: ProjectViewModel;

$(() => {
    // assign the custom event thing
    ko.bindingHandlers.fadeVisible = {
        init: (element, valueAccessor) => {
            $(element).toggle(ko.unwrap(valueAccessor()));
        },

        update: (element, valueAccessor) => {
            ko.unwrap(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
        }
    }

    // apply to HTML
    model = new ProjectViewModel();
    ko.applyBindings(model);

    // open search on CTRL-F
    $(document).keydown((event: JQueryKeyEventObject) => {
        if (event.keyCode === 114 || event.ctrlKey && event.keyCode === 70) {
            model.toggleSearch(); event.preventDefault();
        }
    });
});


function onLoadedJson(data: any): void {
    // make a list of all the projects
    var projects: Project[] = [];
    data['feed']['entry'].forEach((item) => {
        projects.push(new Project(
            item['gsx$name']['$t'],
            item['gsx$link']['$t'],
            item['gsx$description']['$t'],
            item['gsx$author']['$t'],
            item['gsx$category']['$t'],
            new Date(item['gsx$timestamp']['$t'])));
    });
    model.projects(projects);
    $(".descriptionText").dotdotdot({
        height: 100,
        watch: true,
        after: ".open"
    });

    setHeader();
    $(window).resize(setHeader)
}

function setHeader() {
    var headerHeight = $("body > header").outerHeight();
    $("main").css("top", headerHeight);
    $(".project:last-child").css("margin-bottom", headerHeight);
}