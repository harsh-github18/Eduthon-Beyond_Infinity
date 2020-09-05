$("#status").change(function () {
    if ($(this).val() == "company") {
        $('#job').show();
        $('#studies').hide();
        $('#startup').hide();
        $('#other').hide();
    } else if ($(this).val() == "study") {
        $('#studies').show();
        $('#startup').hide();
        $('#job').hide();
        $('#other').hide();
    } else if ($(this).val() == "startup") {
        $('#startup').show();
        $('#studies').hide();
        $('#job').hide();
        $('#other').hide();
    } else if ($(this).val() == "other") {
        $('#other').show();
        $('#startup').hide();
        $('#studies').hide();
        $('#job').hide();
    } else {
        $('#other').hide();
        $('#studies').hide();
        $('#startup').hide();
        $('#job').hide();
    }
});
$("#status").trigger("change");

