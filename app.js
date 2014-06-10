var Project = (function () {
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

var ProjectViewModel = (function () {
    function ProjectViewModel() {
        var _this = this;
        this.projects = ko.observableArray();

        this.projectPopup = ko.observable(false);
        this.selectedProject = ko.observable(new Project());

        this.contactVisible = ko.observable(false);
        this.sortVisible = ko.observable(false);

        this.searchVisible = ko.observable(false);
        this.searchResultText = ko.observable("");
        this.searchResults = ko.observableArray();

        this.searchInput = ko.observable("");

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
            var element = $("main > section:nth-child(" + (_this.projects.indexOf(item) + 1) + ")");
            $("main").animate({
                scrollTop: element.position().top + $("main").scrollTop()
            }, function () {
                $("#currentProject").css("background-color", element.css("background-color"));
                _this.toggleProjectPopup();
            });

            $("#searchField").val('');
            _this.searchInput('');
            _this.searchResults.removeAll();
            _this.searchVisible(false);
        });
    }
    ProjectViewModel.prototype.scrollToProject = function (item) {
    };

    ProjectViewModel.prototype.openLink = function (item) {
        window.open(item.url, "_blank");
    };

    ProjectViewModel.prototype.toggleProjectPopup = function () {
        if (this.contactVisible()) {
            this.toggleContact();
        }

        this.projectPopup(!this.projectPopup());
        this.projectPopup() ? $("#fade").fadeIn() : $("#fade").fadeOut();
    };

    ProjectViewModel.prototype.toggleContact = function () {
        this.contactVisible(!this.contactVisible());
        this.contactVisible() ? $("#fade").fadeIn() : $("#fade").fadeOut();
    };

    ProjectViewModel.prototype.toggleSort = function () {
        this.searchVisible(false);

        this.sortVisible(!this.sortVisible());
    };

    ProjectViewModel.prototype.toggleSearch = function () {
        this.sortVisible(false);

        this.searchVisible(!this.searchVisible());
    };

    ProjectViewModel.prototype.sortProjects = function (data, event) {
        $(".project:last-child").css("margin-bottom", 0);
        var sortBy = event.currentTarget.dataset['value'];
        this.projects(this.projects().sort(function (a, b) {
            if (a[sortBy] > b[sortBy]) {
                return 1;
            } else if (a[sortBy] < b[sortBy]) {
                return -1;
            } else {
                return 0;
            }
        }));
        setHeader();
    };
    return ProjectViewModel;
})();

var model;

$(function () {
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            $(element).toggle(ko.unwrap(valueAccessor()));
        },
        update: function (element, valueAccessor) {
            ko.unwrap(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    model = new ProjectViewModel();
    ko.applyBindings(model);

    $(document).keydown(function (event) {
        if (event.keyCode === 114 || event.ctrlKey && event.keyCode === 70) {
            model.toggleSearch();
            event.preventDefault();
        }
    });
});

function onLoadedJson(data) {
    var projects = [];
    data['feed']['entry'].forEach(function (item) {
        projects.push(new Project(item['gsx$name']['$t'], item['gsx$link']['$t'], item['gsx$description']['$t'], item['gsx$author']['$t'], item['gsx$category']['$t'], new Date(item['gsx$timestamp']['$t'])));
    });
    model.projects(projects);
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
//# sourceMappingURL=app.js.map
