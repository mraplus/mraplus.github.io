/// <reference path="lib/Knockout.d.ts" />
/// <reference path="lib/jQuery.d.ts" />
/** A container for the information associated with each project */
var Project = (function () {
    /**
    * Creates a new Project
    * @param (string) name - The Project name
    * @param (string) url - Link to project
    * @param (string) description - The description of the project shown
    * @param (string) author - The author(s) of the project
    * @param (string) type - Type of project
    * @param (Date) timestamp - The date this project was added
    */
    function Project(name, url, description, author, type, timestamp) {
        if (typeof name === "undefined") { name = ""; }
        if (typeof url === "undefined") { url = ""; }
        if (typeof description === "undefined") { description = ""; }
        if (typeof author === "undefined") { author = ""; }
        if (typeof type === "undefined") { type = ""; }
        if (typeof timestamp === "undefined") { timestamp = new Date(); }
        this.name = name;
        this.url = url;
        this.description = description;
        this.author = author;
        this.type = type;
        this.timestamp = timestamp;
    }
    return Project;
})();

/** Holds our data */
var ProjectViewModel = (function () {
    /** Initializes the ViewModel with everything blank */
    function ProjectViewModel() {
        var _this = this;
        this.projects = ko.observableArray();

        this.projectPopup = ko.observable(false);
        this.selectedProject = ko.observable(new Project());

        this.contactVisible = ko.observable(false);

        this.sortVisible = ko.observable(false);
        this.sortDirection = 1;

        this.searchVisible = ko.observable(false);
        this.searchResultText = ko.observable("");
        this.searchResults = ko.observableArray();

        this.searchInput = ko.observable("");

        // Find search results on input
        this.searchInput.subscribe(function (value) {
            _this.searchResults.removeAll();
            if (value !== "") {
                _this.projects().forEach(function (project) {
                    var searchString = [project.name, project.description, project.author].join(' ').toLowerCase();
                    if (searchString.indexOf(value.toLowerCase()) !== -1) {
                        _this.searchResults.push(project);
                    }
                });
            }
        });

        this.selectedProject.subscribe(function (item) {
            // index is incremented because CSS is NOT 0-based
            var element = $("main > section:nth-child(" + (_this.projects.indexOf(item) + 1) + ")");
            $("main").animate({
                scrollTop: element.position().top + $("main").scrollTop()
            }, function () {
                $("#currentProject").css("background-color", element.css("background-color"));
                _this.toggleProjectPopup();
            });

            // reset form
            $("#searchField").val('');
            _this.searchInput('');
            _this.searchResults.removeAll();
            _this.searchVisible(false);
        });
    }
    /** Smoothly scrolls the document to the project. Implemented in constructor because of (this) issues */
    ProjectViewModel.prototype.scrollToProject = function (item) {
    };

    /** Opens (in a new window) the item's link */
    ProjectViewModel.prototype.openLink = function (item) {
        window.open(item.url, "_blank");
    };

    /** Opens/Closes the project popup */
    ProjectViewModel.prototype.toggleProjectPopup = function () {
        if (this.contactVisible()) {
            this.toggleContact();
        }

        this.projectPopup(!this.projectPopup());
        this.projectPopup() ? $("#fade").fadeIn() : $("#fade").fadeOut();
    };

    /** Toggles visiblity of credits */
    ProjectViewModel.prototype.toggleContact = function () {
        this.contactVisible(!this.contactVisible());
        this.contactVisible() ? $("#fade").fadeIn() : $("#fade").fadeOut();
    };

    /** Toggles the visiblity of the sort menu */
    ProjectViewModel.prototype.toggleSort = function () {
        // disable all other popup boxes
        this.searchVisible(false);

        this.sortVisible(!this.sortVisible());
    };

    /** Toggles the visibility of the search box */
    ProjectViewModel.prototype.toggleSearch = function () {
        // disable all other popup boxes
        this.sortVisible(false);

        this.searchVisible(!this.searchVisible());
    };

    /** Sorts the projects (grid is automatically updated) */
    ProjectViewModel.prototype.sortProjects = function (data, event) {
        var _this = this;
        $(".project:last-child").css("margin-bottom", 0); // reset margin
        $(".button[data-value='" + this.sortBy + "']").removeClass('ascending descending selected'); // reset button

        var element = $(event.currentTarget).addClass('selected');
        var newSort = element.data("value");
        if (newSort === this.sortBy) {
            this.sortDirection *= -1;
        } else {
            this.sortBy = newSort;
            this.sortDirection = 1;
        }
        this.sortDirection === 1 ? element.addClass('descending') : element.addClass('ascending');
        this.projects(this.projects().sort(function (a, b) {
            if (a[_this.sortBy] > b[_this.sortBy]) {
                return _this.sortDirection;
            } else if (a[_this.sortBy] < b[_this.sortBy]) {
                return -(_this.sortDirection);
            } else {
                return 0;
            }
        }));
        setHeader();
    };
    return ProjectViewModel;
})();

// allows inspecting of VM from Console
var model;

$(function () {
    // assign the custom event thing
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            $(element).toggle(ko.unwrap(valueAccessor()));
        },
        update: function (element, valueAccessor) {
            ko.unwrap(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    // apply to HTML
    model = new ProjectViewModel();
    ko.applyBindings(model);

    // open search on CTRL-F
    $(document).keydown(function (event) {
        if (event.keyCode === 114 || event.ctrlKey && event.keyCode === 70) {
            model.toggleSearch();
            event.preventDefault();
        }
    });
});

/** Called when the spreadsheet data is received */
function onLoadedJson(data) {
    $("#loading").remove();
    model.projects(data['feed']['entry'].map(function (item) {
        return new Project(item['gsx$name']['$t'], item['gsx$link']['$t'], item['gsx$description']['$t'], item['gsx$author']['$t'], item['gsx$category']['$t'], new Date(item['gsx$timestamp']['$t']));
    }));
    $(".descriptionText").dotdotdot({
        height: 100,
        watch: true,
        after: ".open"
    });

    setHeader();
    $(window).resize(setHeader);
}

function setHeader() {
    var headerHeight = $("body > header").outerHeight();
    $("main").css("top", headerHeight);
    $(".project:last-child").css("margin-bottom", headerHeight);
}
