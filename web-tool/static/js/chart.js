var chart = null;

function ajaxGetData(jsonId, pointId)
{
    $.ajax({
        url: '/ajax/ajax_getChartData/',
        data: {
            'json_id': jsonId,
            'point_id': pointId
        },
        dataType: 'json',
        success: function (data) {
            if (jQuery.isEmptyObject(data))
            {
                $('.JSChart').html('<strong class="not-found">Data pro tento bod nebyla nalezena, zkuste prosím jiný bod</strong>');
                hideLoader();

                return false;
            }

            let labelsChart = [];
            let dataCumChart = [];
            let dataVelChart = data['vel'];
            let dataCohChart = data['coh'];

            let keyRegCum = new RegExp('^(cumT)+.+$');

            $.each(data, function (key, value) {
                if (keyRegCum.test(key))
                {
                    labelsChart.push(key.replace('cumT', ''));
                    dataCumChart.push(value);
                }
            });

            makeChart(labelsChart, dataCumChart, dataVelChart, dataCohChart);
        }
    });
}

function makeChart(labelsChart, dataCumChart, dataVelChart = null, dataCohChart = null) {

    var ctx = document.getElementById('chart1').getContext('2d');

    if (dataCohChart !== null)
    {
        let textContainer = '';
        let velocity = dataVelChart;
        let coherence = dataCohChart;

        if (velocity !== null || coherence !== null)
        {
            textContainer += "<div class='text-container'>";

            if (velocity !== null)
            {
                textContainer += "<p><strong>Rychlost pohybu (mm/rok):</strong> " + velocity + "</p>";
            }

            if (coherence !== null)
            {
                textContainer += "<p><strong>Koherence:</strong> " + coherence + "</p>";
            }

            textContainer += "</div>";
        }

        $('.JSChart').after(textContainer);

        chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsChart,
            datasets: [{
                    label: 'Kumulativní posun',
                    backgroundColor: '#3b528b',
                    data: dataCumChart,
                    spanGaps: true
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontColor: '#212121',
                fontSize: 17,
                fontStyle: 'normal',
                text: 'Kumulativní posun'
            },
            scales: {
                y: {
                    title: {
                        color: '#212121',
                        display: true,
                        text: 'POSUN (mm)',
                        font: {
                            weight: 'bold',
                            size: 15,
                        }
                    },
                    ticks: {
                        fontSize: 13,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: dataCSVTitle,
                        fontSize: 15,
                        fontStyle: 'bold'
                    }
                },
                x: {
                    title: {
                        color: '#212121',
                        display: true,
                        text: 'DATUM (yyyy-mm-dd)',
                        font: {
                            weight: 'bold',
                            size: 15,
                        }
                    },
                    ticks: {
                        fontSize: 13
                    }
                }
            }
        }
    });
    }
    else
    {
        chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsChart,
            datasets: [{
                    label: dataCSVTitle,
                    backgroundColor: '#3b528b',
                    data: dataCumChart,
                    spanGaps: true
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontColor: '#212121',
                fontSize: 17,
                fontStyle: 'normal',
                text: dataCSVTitle
            },
            scales: {
                y: {
                    title: {
                        color: '#212121',
                        display: true,
                        text: 'POSUN (mm)',
                        font: {
                            weight: 'bold',
                            size: 15,
                        }
                    },
                    ticks: {
                        fontSize: 13,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: dataCSVTitle,
                        fontSize: 15,
                        fontStyle: 'bold'
                    }
                },
                x: {
                    title: {
                        color: '#212121',
                        display: true,
                        text: 'DATUM (yyyy-mm-dd)',
                        font: {
                            weight: 'bold',
                            size: 15,
                        }
                    },
                    ticks: {
                        fontSize: 13
                    }
                }
            }
        }
    });
    }

    hideLoader();
}