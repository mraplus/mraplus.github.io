var Project = (function () {
    function Project(name, url, description, author) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.author = author;
        this.searchText = [name, description, author].join(' ');
        this.visible = ko.observable(true);
    }
    return Project;
})();

var ProjectViewModel = (function () {
    function ProjectViewModel(projects) {
        this.projects = ko.observableArray(projects);

        this.sortVisible = ko.observable(false);
        this.searchVisible = ko.observable(false);

        this.searchInput = ko.observable("");
        this.searchInput.subscribe(function (value) {
            projects.forEach(function (project, index, array) {
                if (project.searchText.toLowerCase().indexOf(value.toLowerCase()) === -1) {
                    array[index].visible(false);
                } else {
                    array[index].visible(true);
                }
            });
        });
    }
    ProjectViewModel.prototype.openLink = function (item) {
        window.open(item.url, "_blank");
    };

    ProjectViewModel.prototype.toggleSort = function () {
        this.searchVisible(false);

        this.sortVisible(!this.sortVisible());
    };

    ProjectViewModel.prototype.toggleSearch = function () {
        this.searchVisible(false);

        this.searchVisible(!this.searchVisible());
    };

    ProjectViewModel.prototype.sortProjects = function (data, event) {
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
    };
    return ProjectViewModel;
})();

function onLoadedJson(data) {
    var projects = [];
    data['feed']['entry'].forEach(function (item) {
        projects.push(new Project(item['gsx$name']['$t'], item['gsx$link']['$t'], item['gsx$description']['$t'], item['gsx$author']['$t']));
    });

    var model = new ProjectViewModel(projects);
    ko.applyBindings(model);
}
;
//# sourceMappingURL=app.js.map
