

var bio = {
  "name" : "Lavanya",
  "role" : "Web Developer",
  "contacts": {
    "mobile": "57-6987-987",
    "email": "lav2gmail.com",
    "github": "chefnfoodie",
    "twitter": "chefnfoodie",
    "location": "Burnaby, BC. Canada"
   },
   "welcomeMessage" : "HELLO AND HOPE U FIND THIS RESUME AWESOME",
   "skills" : ["css","html","awesomeness","creativity"],
   "biopic": "images/fry.jpg"
 }



var work = {
  "jobs" : [
  {
    "title" : " Java programmer ",
    "employer" : "InfoBiz Technologies",
    "location" : "Chennai, India.",
    "dates": "2004-2008",
    "description": "Core java, basic javascript"
  },
  {
    "title" : "Assistant Programmer",
    "employer" : "Pansoft",
    "location" : "Chennai, India.",
    "dates": "2008-2012",
    "description": "worked on JSP, MVC architecture"
  }
  ]
}

var education = {
  "schools": [
  {
    "name": " SRM Easwari Engineering College",
    "city": " Chennai, India.",
    "course": "Bachelor of Engineering",
    "major": "Electronics and Communication",
    "years":"2000-2004"
  },
  {
    "name": "British Columbia Institute of Technology",
    "city": " Burnaby, BC. Canada",
    "course": "Web development and design-COMP 1950",
    "major": "Applied Web Development",
    "years":"2013"
  },
  {
   "name": "Alliance Francaise",
   "city": " Chennai, India.",
   "course": "A2 levels",
   "major": "B1",
   "years": "2009"

 }
 ],
 "onlineCourses" : [
 {
  "title": "Javascript Crash Course",
  "school": "Udacity",
  "date": "2015",
  "url": "http://www.udacity.com/course/ud804"
}
]
}

var projects = {
  "projects": [
  {
    "title": " Silver Design 1950 Project",
    "dates": "11-2014 ",
    "description": "The objective of this project is to build a prototype website for the COMP-1950 course. The intention of the project is to use the concepts and techniques learnt during COMP-1950 and incorporate the best design practices to build a model website that would help the course instructor to provide course tutorials and other materials in an accessible, interactive, easy to navigate way that is compatible across multiple devices. A website created for this project that describes the project and links to various artifacts.An introduction home page that describes the project and the members page that describes the contribution of each member and their contact information. A contact page that provides the instructors contact information and BCIT links. A proto-site that has three of the main pages mocked up. The home page, resources page, two lecture pages, table of contents, forum and a blog page are provided. The blog page provides timely news and is designed with Tumblr. The template has been made to match with the rest of the pages. Wireframe of the major sections of the site includes descriptions of what is included in each content area. Sitemap that describes the list of accessible pages developed in this project. Rationale page - It describes why the site was built in the way proposed.",
    "image": ["images/sitemap.jpg"]
  },
  {
    "title": " Portfolio Page",
    "dates": " 03-2015 ",
    "description": "To aim was to replicate the provided mockup design as closely as possible in HTML and CSS and develop a responsive website for a single product overview page.  The popular Twitter's Bootstrap framework was used to build the page.",
    "image": ["images/pagemock.png"]
  }
  ]
}



bio.display = function() {
  var name = "Lavanya Swaminathan";
  var formattedName = HTMLheaderName.replace("%data%", name);
  var role = "Web Developer";
  var formattedRole = HTMLheaderRole.replace("%data%", role);
  $("#header").prepend(formattedRole);
  $("#header").prepend(formattedName);

var formattedImage = HTMLbioPic.replace("%data%",bio.biopic);
  $("#header").append(formattedImage);
  var formattedMessage = HTMLwelcomeMsg.replace("%data%",bio.welcomeMessage);
  $("#header").append(formattedMessage);



  if (bio.skills.length > 0) {

  $("#header").append(HTMLskillsStart);
  var formattedSkills = HTMLskills.replace("%data%", bio.skills[0]);
  $("#skills").append(formattedSkills);
  formattedSkills  =  HTMLskills.replace("%data%", bio.skills[1]);
  $("#skills:last").append(formattedSkills);
  formattedSkills  =  HTMLskills.replace("%data%", bio.skills[2]);
  $("#skills:last").append(formattedSkills);
  formattedSkills =  HTMLskills.replace("%data%", bio.skills[3]);
  $("#skills:last").append(formattedSkills);

  $("#skills").css({"display":"block"});
  $('#skills > *').css('display', 'block');
}

var mobileValue = HTMLmobile.replace("%data%", bio.contacts.mobile);
var emailValue = HTMLemail.replace("%data%", bio.contacts.email);
var githubValue = HTMLgithub.replace("%data%", bio.contacts.github);
var twitterValue = HTMLtwitter.replace("%data%", bio.contacts.twitter);
var locationValue = HTMLlocation.replace("%data%", bio.contacts.location);
$("#topContacts:last").prepend(mobileValue +emailValue +githubValue +twitterValue +locationValue);
$("#footerContacts:last").append(mobileValue +emailValue +githubValue +twitterValue +locationValue);



}





workExperience.display = function() {
  var i = 0;
  $("#workExperience").append(HTMLworkStart);
  for (  i = 0 ; i < work.jobs.length; i++) {
    var obj = work.jobs[i];
    var formattedEmp = HTMLworkEmployer.replace("%data%",obj.employer);
    var formattedTitle = HTMLworkTitle.replace("%data%",obj.title);
    var formattedEmpTitle = formattedEmp + formattedTitle;
    var formattedDates = HTMLworkDates.replace("%data%",obj.dates);
    var formattedLocation = HTMLworkLocation.replace("%data%",obj.location);
    var formattedDes = HTMLworkDescription.replace("%data%",obj.description);
    $(".work-entry:last").append(formattedEmpTitle +formattedDates +formattedLocation +formattedDes);
  }
}

education.display = function() {
  var i = 0;
  $("#education").append(HTMLschoolStart);
  for (  i = 0 ; i < education.schools.length; i++) {
    var obj = education.schools[i];
    var formattedEdu = HTMLschoolName.replace("%data%",obj.name);
    var formattedCourse = HTMLschoolDegree.replace("%data%",obj.course);
    var formattedMaj = HTMLschoolMajor.replace("%data%",obj.major);
    var formattedDate = HTMLschoolDates.replace("%data%",obj.years);
    if (obj.years == null) {
      formattedDate = "";
    }
    if(obj.major == null) {
      formattedMaj = "";
    }
    $(".education-entry:last").append(formattedEdu + formattedCourse);
    $(".education-entry:last").append(formattedDate + formattedMaj);


  }
  var j = 0;
  $(".education-entry:last").append(HTMLonlineClasses);
  for ( j = 0 ; j < education.onlineCourses.length; j++) {
    var obj1 = education.onlineCourses[j];
    var formattedTitle = HTMLonlineTitle.replace("%data%",obj1.title);
    var formattedDate1 = HTMLonlineDates.replace("%data%",obj1.date);
    var formattedSchool = HTMLonlineSchool.replace("%data%",obj1.school);
    var formattedUrl = HTMLonlineURL.replace("%data%",obj1.url);
  }
  $(".education-entry:last").append(formattedTitle  +formattedSchool + formattedDate1 + formattedUrl);
}


$(document).click(function(loc) {
  var x =loc.pageX;
  var y = loc.pageY;
  logClicks(x,y);
});

$("#main").append(internationalizeButton);

function inName(name) {
  var name = name.trim().split(" ");
  name[1]=name[1].toUpperCase();
  name[0]= name[0].slice(0,1).toUpperCase() + name[0].slice(1).toLowerCase();
  return name[0] + " " + name[1];
}

projects.display = function() {
  for (proj in projects.projects) {
    $("#projects").append(HTMLprojectStart);
    var formattedTitle = HTMLprojectTitle.replace("%data%",projects.projects[proj].title);
    $(".project-entry:last").append(formattedTitle);
    var formattedDates = HTMLprojectDates.replace("%data%",projects.projects[proj].dates);
    $(".project-entry:last").append(formattedDates);
    var formattedDescription = HTMLprojectDescription.replace("%data%",projects.projects[proj].description);
    $(".project-entry:last").append(formattedDescription);

    for (img in projects.projects[proj].image) {
      var formattedImage2 = HTMLprojectImage.replace("%data%",projects.projects[proj].image[img]);
      $(".project-entry:last").append(formattedImage2);
    }
  }
  var toggle = true;
  $(".projectImage").hover(function() {
    var large = {'max-width' : '90%','max-height' : '90%'};
    var normal = {'max-width' : '50%','max-height' : '30%'};

    if(toggle)
      $(this).animate(large, 'slow');
    else
     // $(this).animate({height:200},400);
     $(this).animate(normal, 'slow');
    toggle = !toggle;
  });
}

bio.display();
workExperience.display();
education.display();
projects.display();

$("#mapDiv").append(googleMap);




