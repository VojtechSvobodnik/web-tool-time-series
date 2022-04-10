$('#JSUploadBtn').click(function () {
    if($('#JSUploadWrapper').hasClass('hide'))
    {
        $('#JSUploadWrapper').removeClass('hide');
    }
    else
    {
        $('#JSUploadWrapper').addClass('hide');
    }

    return false;
});

$(document).on('click', '#JSLegendBtn', function () {
    if($('#JSLegendWrapper').hasClass('m-hide'))
    {
        $('#JSLegendWrapper').removeClass('m-hide');
    }
    else
    {
        $('#JSLegendWrapper').addClass('m-hide');
    }

    return false;
});

var dataCSVTitle = null;
var fileLoaded = null;
var CSVFile = null;

$(document).on('change', '#CSVDataForm input[type="file"]', function () {
    fileLoaded = true;
    CSVFile = event.target.files[0];

    if (dataCSVTitle === null)
    {
        $('#CSVDataForm input[type="text"]').addClass('red-border');
        return false;
    }

    submitForm();
});

$(document).on('change', '#CSVDataForm input[type="text"]', function () {
    dataCSVTitle = $(this).val();

    if (fileLoaded === true)
    {
        submitForm();
    }
});

function submitForm()
{
    $('#CSVData').submit();

    $('#CSVDataForm input[type="text"]').removeClass('red-border');

    showLoader();

    loadCsvFile(URL.createObjectURL(CSVFile));
}

function showLoader()
{
    $('.JSLoader').show();
}

function hideLoader()
{
    $('.JSLoader').hide();
}