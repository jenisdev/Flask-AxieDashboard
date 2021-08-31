$(document).ready(function () {

    var currency_signs = { 'gbp': "&pound;", 'eur': "&euro;", 'usd': "&dollar;", 'php': "&#8369;" }

    $('#currency').change(ev => {

        var currency = $('#currency option:selected').val().toLowerCase()
        $.ajax({
            url: '/getRate',
            method: 'POST',
            data: { currency: currency },
            success: function (res) {
                var rate = JSON.parse(res).rate
                document.getElementById('crypto-rate').value = rate
                if ($('input[name=show_value]').prop('checked')) {
                    $('.currency-value').each(function (i, obj) {
                        var crypto = Number($(obj).parent().find('.crypto-value').text())
                        var value = rate * crypto
                        $(obj).html(/* "&#8776;" + */ currency_signs[currency] + "&nbsp;" + value.toFixed(2))
                    })
                }
                $('#current_rate').html(currency_signs[currency] + "&nbsp;" + rate.toFixed(2))
                console.log($('#total_avg').data('value'))
                $('#total_avg').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#total_avg').data('value'))).toFixed(2))
                $('#total_sum').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#total_sum').data('value'))).toFixed(2))
                $('#unclaimed_sum').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#unclaimed_sum').data('value'))).toFixed(2))
                $('#claimed_sum').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#claimed_sum').data('value'))).toFixed(2))
                $('#total_manager_share').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#total_manager_share').data('value'))).toFixed(2))
                $('#total_scholar_share').html("&#8776;" + currency_signs[currency] + "&nbsp;" + (rate * Number($('#total_scholar_share').data('value'))).toFixed(2))
            }
        })


    })

    $('input[name=show_value]').change(ev => {
        if ($(ev.target).prop('checked')) {
            var currency = $('#currency option:selected').val().toLowerCase()
            $.ajax({
                url: '/getRate',
                method: 'POST',
                data: { currency: currency },
                success: function (res) {
                    var rate = JSON.parse(res).rate
                    document.getElementById('crypto-rate').value = rate

                    $('.currency-value').each(function (i, obj) {
                        var crypto = Number($(obj).parent().find('.crypto-value').text())
                        var value = rate * crypto
                        // $(obj).text("≈ " + value.toFixed(2) + " " + $('#currency option:selected').val())
                        $(obj).html(/* "&#8776;" +  */currency_signs[currency] + "&nbsp;" + value.toFixed(2))
                    })
                }
            })
        } else {
            $('.currency-value').each(function (i, obj) {
                $(obj).text('')
            })
        }
    })

    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tracker-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function timeConversion(millisec) {
        var now = Date.now();

        var intervalMillisec = now - millisec;

        var seconds = (intervalMillisec / 1000).toFixed(0);

        var minutes = (intervalMillisec / (1000 * 60)).toFixed(0);

        var hours = (intervalMillisec / (1000 * 60 * 60)).toFixed(0);

        var days = (intervalMillisec / (1000 * 60 * 60 * 24)).toFixed(0);

        if (seconds < 60) {
            return seconds + " Sec";
        } else if (minutes < 60) {
            return minutes + " Min";
        } else if (hours < 24) {
            return hours + " Hrs";
        } else {
            return days + " Days"
        }
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    function ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    // Claimed On Column sorting function
    $.fn.dataTableExt.oSort["customdate-desc"] = function (x, y) {
        x = convert_sort_value(x); y = convert_sort_value(y);
        if ( x > y ) return -1;
        return 1;
    };

    $.fn.dataTableExt.oSort["customdate-asc"] = function (x, y) {
        x = convert_sort_value(x); y = convert_sort_value(y);
        if ( x > y ) return 1;
        return -1;
    }

    $.fn.dataTableExt.oSort["mixdate-desc"] = function (x, y)
    {
        x = $(x)[0].attributes[2].nodeValue
        y = $(y)[0].attributes[2].nodeValue
        if ( x > y ) return -1;
        return 1;
    };

    $.fn.dataTableExt.oSort["mixdate-asc"] = function (x, y)
    {
        x = $(x)[0].attributes[2].nodeValue
        y = $(y)[0].attributes[2].nodeValue
        if ( x > y ) return 1;
        return -1;
    }
    
    function convert_sort_value(str)
    {
        if (str == null || str == 'null') return 0;
        var date_part = str.split(",")[0];
        var time_part = str.split(",")[1];
        
        var res = Number(time_part.split(":")[1]) + Number(time_part.split(":")[0]) * 100;
        res += monthNames.indexOf(date_part.split(" ")[1]) * 1000000 + Number(date_part.split(" ")[0].slice(0, -2)) * 10000
        
        return res;
    }

    var t = $("#tracker-table").DataTable({
        "dom"           : 'Bltipr',
        "ajax"          : "/data",
        "searching"     : true,
        "bLengthChange" : false,
        "bPaginate"     : false,
        // "fixedHeader"   : true,
        "order"         : [[ 1, 'asc' ]],
        "buttons"       : [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                customize: function( xlsx ) {
                    
                }     
            }
        ],
        "serverSide": false,
        'processing': true,
        'language': {
            'loadingRecords': '&nbsp;',
            'processing': '<div class="spinner"></div>'
        },
        "columnDefs"    : [
            {
                "targets": 0,
                "searchable": false,
                "orderable": false
            },
            {
                "targets": 1,
                "type": 'natural-nohtml',
                "render": function ( data, type, row ) {
                    var content = `<a class="link-primary text-cyan" href="https://marketplace.axieinfinity.com/profile/ronin:${row[0]}/axie"
                                    target="_blank" rel="noreferrer">${row[1]}</a>`
                    return content
                }
            },
            {
                "targets": 2,
                "orderable": true,
                "render": function ( data, type, row ) {
                    data = Number(data);
                    color = 'red';
                    if (data < 150) color = "red";
                    else if (data > 149 && data < 200) color = "orange";
                    else color = "green";
                    return `<span class="crypto-value text-${color}">${data}</span><br><span class="text-subtext currency-value">`
                }
            },
            {
                "targets": 3,
                "orderable": true,
                "render": function ( data, type, row ) {
                    data = Number(data);
                    color = 'red';
                    if (data < 150) color = "red";
                    else if (data > 149 && data < 200) color = "orange";
                    else color = "green";
                    return `<span class="crypto-value text-${color}">${data}</span><br><span class="text-subtext currency-value">`
                }
            },
            {
                "targets": 4,
                "orderable": true,
                "render": function ( data, type, row ) {
                    data = Number(data);
                    color = 'red';
                    if (data < 76) color = "red";
                    else if (data > 75 && data < 136) color = "orange";
                    else color = "green";
                    return `<span class="crypto-value text-${color}">${data}</span><br><span class="text-subtext currency-value">`
                }
            },
            {
                "targets": 5,
                "orderable": true,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span>`
                }
            },
            {
                "targets": 6,
                "orderable": true,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span>`
                }
            },
            {
                "targets": 7,
                "orderable": true,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="text-subtext currency-value">`
                }
            },
            {
                "targets": 8,
                "orderable": true,
                "type": "mixdate",
                "render": function ( data, type, row ) {
                    const milliseconds = Number(data) * 1000

                    const dateObject = new Date(milliseconds)
                    
                    // const humanDateFormat = dateObject.toLocaleString().split(",")[0]
                    const humanDateFormat = ordinal_suffix_of(dateObject.getDate()) + " " + monthNames[dateObject.getMonth()] + ", "
                                            + dateObject.getHours() + ":" + dateObject.getMinutes();
                    
                    var timeInterval = timeConversion(milliseconds)

                    var color = "white";
                    
                    if (timeInterval.search("Days") != -1) {
                        var value = Number(timeInterval.split(" ")[0]);
                        if ( value >= 7 && value <= 13 ) color = "orange";
                        else if( value < 7 ) color = "red";
                        else color = "green"
                    } else {
                        color = "red"
                    }

                    var content = `<span class="full-date text-${color} text-subtext" style="display: none;" orignial="${data}">${humanDateFormat}</span>
                    <span class="interval-days text-${color}" style="display: block;">${timeInterval}</span>`
                    return content
                }
            },
            {
                "targets": 9,
                "orderable": true,
                "type": "customdate",
                "render": function ( data, type, row ) {
                    const milliseconds = Number(data) * 1000

                    const dateObject = new Date(milliseconds)
                    
                    // const humanDateFormat = dateObject.toLocaleString().split(",")[0]
                    const humanDateFormat = ordinal_suffix_of(dateObject.getDate()) + " " + monthNames[dateObject.getMonth()] + ", "
                                            + dateObject.getHours().toLocaleString('en-US', {
                                                minimumIntegerDigits: 2,
                                                useGrouping: false
                                              }) + ":" + dateObject.getMinutes().toLocaleString('en-US', {
                                                minimumIntegerDigits: 2,
                                                useGrouping: false
                                              });
                    return humanDateFormat
                }
            },
            {
                "targets": 10,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = Math.round(data / 100 * row[7])
                    return `<span class="crypto-value">${val}</span>`
                }
            },
            {
                "targets": 11,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = Math.round(data / 100 * row[7])
                    return `<span class="crypto-value">${val}</span>`
                }
            },
            {
                "targets": 12,
                "orderable": false,
                "visible": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span>`
                }
            },
            {
                "targets": 13,
                "orderable": false,
                "visible": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span>`
                }
            },
            {
                "targets": 14,
                "orderable": false,
                "visible": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span>`
                }
            },
            {
                "targets": 15,
                "orderable": false,
                "render": function (data, type, row) {
                    return `<i class="bi bi-pencil-square btn-action bg-green-2"></i>
                            <i class="bi bi-trash btn-action bg-blue-2"></i></span>`
                }
            }
        ],
        "columns": [
        ],
        "bFilter"       : true
    })

    $(".dt-buttons").hide()

    t.on( 'order.dt search.dt', function () {
        t.column(0).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

    $('input[name=show_rank]').on( 'change', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = t.column( $(this).attr('data-column') );

        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

    $('input[name=show_mmr]').on( 'change', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = t.column( $(this).attr('data-column') );
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );
    $('input[name=show_arena]').on( 'change', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = t.column( $(this).attr('data-column') );
 
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );
    $('#sort-column').on( 'change', function (e) {
        var column = Number($('#sort-column option:selected').val())
        var order = 'asc';
        // Sort by column 1 and then re-draw
        if (column == 1) order = Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'desc';
        else order =  Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'desc';
        t
        .order( [ column, order ] )
        .draw();
    } );
    
    $('#sort-order').on( 'change', function (e) {
        var column = Number($('#sort-column option:selected').val())
        var order = 'asc';
        // Sort by column 1 and then re-draw
        if (column == 1) order = Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'desc';
        else order =  Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'desc';
        t
        .order( [ column, order ] )
        .draw();
    } );

    $('#search').keyup(function(){
        t
        .search($(this).val())
        .draw() ;
    } );

    $('input[name=full_date]').on("change", function (ev) {
        if ($(ev.target).prop('checked')) {
            $('#tracker-table tbody td .full-date').prop('style', 'display: block;')
            $('#tracker-table tbody td .interval-days').prop('style', 'display: none')
        } else {
            $('#tracker-table tbody td .interval-days').prop('style', 'display: block;')
            $('#tracker-table tbody td .full-date').prop('style', 'display: none')
        }
    } );

    $("#export_btn").on("click", function (ev) {
        $(".buttons-excel").trigger("click");
    });
})