/*$("#myButton").click(function () {
    //alert('clicked')
    $("#div").load("#div");
});
*/
var cards = document.getElementsByClassName("card-user");

function filter() {
    for (var i = 0; i < cards.length; i++) {
        var college="", gender="", skill="", mentor="";
        if (cards[i].getElementsByClassName("card")[0].getElementsByClassName("college")[0])
            college = cards[i].getElementsByClassName("card")[0].getElementsByClassName("college")[0].innerHTML;
        if (cards[i].getElementsByClassName("card")[0].getElementsByClassName("gender")[0])
            gender = cards[i].getElementsByClassName("card")[0].getElementsByClassName("gender")[0].innerHTML;
        if (cards[i].getElementsByClassName("card")[0].getElementsByClassName("skill")[0])
            skill = cards[i].getElementsByClassName("card")[0].getElementsByClassName("skill")[0].innerHTML;
        if (cards[i].getElementsByClassName("card")[0].getElementsByClassName("mentor")[0])
            mentor = cards[i].getElementsByClassName("card")[0].getElementsByClassName("mentor")[0].innerHTML;
        var f_college = document.getElementById("f-college").value;
        var f_gender = document.getElementById("f-gender").value;
        var f_skill = document.getElementById("f-skill").value;
        var f_mentor = document.getElementById("f-mentor").value;

        //console.log(skill.length);
        //console.log(f_skill.length);
 
        if (f_college != "none" && f_college != college) {
            cards[i].style.display = "none";
        }
        else if (f_mentor != "none" && mentor == "No") {
            cards[i].style.display = "none";
        }
        else if (f_gender != "none" && f_gender != gender) {
            cards[i].style.display = "none";
        }
        else if (f_skill != "none") {
            var j = 0, flag=0, len = f_skill.length;
            while (j >= 0 && j < skill.length - len) {
                //console.log(skill.substring(j, j + len));
                if (skill.substring(j, j + len) == f_skill) {
                    flag = 1;
                    break;
                }
                j++;
            }
            if (flag == 0) {
                cards[i].style.display = "none";
            } else {
                cards[i].style.display = "block";
            }
            
        }
        else {
            cards[i].style.display = "block";
        }
    }
}