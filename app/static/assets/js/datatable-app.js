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
                        $(obj).html("&#8776;" + currency_signs[currency] + "&nbsp;" + value.toFixed(2))
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
                        $(obj).html("&#8776;" + currency_signs[currency] + "&nbsp;" + value.toFixed(2))
                    })
                }
            })
        } else {
            $('.currency-value').each(function (i, obj) {
                $(obj).text('')
            })
        }
    })

    function sortTable(column, order) {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("tracker-table");
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 2; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("td")[column];
                y = rows[i + 1].getElementsByTagName("td")[column];
                // Check if the two rows should switch place:
                if (!order) {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tracker-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

   /*  $(".page-link").click(ev => {
        var page_num = $(ev.target).attr('page_num')
        var per_page = $("#per_page option:selected").val()
        $.ajax({
            url: "/data",
            data: {page_num: page_num, per_page: per_page},
            method: "POST",
            success: function (res) {
                console.log(res)
                let tablebody = "",
                    index = 1;
                for (let row of res.data) {
                    tablebody +=
                    `<tr>
                        <td>${index++}</td>
                        <td><span><a class="link-primary"
                                    href="https://marketplace.axieinfinity.com/profile/ronin:nin:${row[1]}/axie"
                                    target="_blank" rel="noreferrer">${row[0]}</a></strong></span></td>
                        <td><span class="crypto-value">${row[2]}</span><br><span
                                class="currency-value"></span></td>
                        <td><span class="yesterday rounded-3 crypto-value">${row[3]}</span><br><span
                                class="currency-value"></span></td>
                        <td><span class="crypto-value">${row[4]}</span><br><span class="currency-value"></span></td>
                        <td><span class="crypto-value">${row[5]}</span><br><span class="currency-value"></span>
                        </td>
                        <td><span class="crypto-value">${row[6]}</span><br><span class="currency-value"></span>
                        </td>
                        <td><span class="crypto-value">${row[7]}</span><br><span class="currency-value"></span>
                        </td>
                        <td>
                            <span class="text-cyan full-date" style="display: none;">${row[8]}</span>
                            <span class="text-cyan days">${row[8]}</span>
                        </td>
                        <td>${row[9]}</td>
                        <td><span class="crypto-value">--</span>
                            <span class="text-green-2">(${row[10]}%)</span><br><span class="currency-value"></span>
                        </td>
                        <td><span class="crypto-value">--</span>
                            <span class="text-green-2">(${row[11]}%)</span><br><span class="currency-value"></span>
                        </td>
                        <td>${row[12]}</td>
                        <td>${row[13]}</td>
                        <td><i class="bi bi-pencil-square btn-action bg-green-2"></i></td>
                        <td><i class="bi bi-trash btn-action bg-blue-2"></i></td>
                    </tr>`
                }
                $('#table-body').html(tablebody)

                let pagination_body = ""
                if ('prev_num' in res) 
                    pagination_body += `
                    <li class="page-item">
                    <a class="page-link pagenation-previous" page_num="${res.prev_num}" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                    </a>
                    </li>`
                else
                    pagination_body += `
                    <li class="page-item disabled">
                    <a class="page-link pagenation-previous" href="#" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                    </a>    
                    </li>`
                for (page of res.pages) {
                    if (page != 'None') 
                        pagination_body += `
                        <li class="page-item"><a class="page-link" page_num="${page}">${page}</a></li>
                        `
                    else
                        pagination_body += `
                        <li class="page-item disabled" id="example_ellipsis"><a href="#" class="page-link pagenation-expand">...</a></li>
                        `
                }
                if ('next_num' in res) 
                    pagination_body += `
                    <li class="page-item">
                    <a class="page-link pagenation-previous" page_num="${res.next_num}" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                    </a>
                    </li>`
                else
                    pagination_body += `
                    <li class="page-item disabled">
                    <a class="page-link pagenation-previous" href="#" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                    </a>    
                    </li>`
                $('#pagination-bar').html(pagination_body)
            }
        })
    }) */

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

    /* jQuery.fn.dataTableExt.oSort['natural-asc']  = function(a,b) {
        return naturalSort(a,b);
    };
    
    jQuery.fn.dataTableExt.oSort['natural-desc'] = function(a,b) {
        return naturalSort(a,b) * -1;
    };

    jQuery.fn.dataTableExt.aTypes.unshift(  
        function ( sData )  
        {  
            var deformatted = sData.replace(/[^d-./a-zA-Z]/g,'');
            if ( $.isNumeric( deformatted ) ) {
                return 'formatted-num';
            }
            return null;  
        }  
    ); */

    $.fn.dataTableExt.oSort["customdate-desc"] = function (x, y)
    {

        x = convert_sort_value(x);
        y = convert_sort_value(y);

        if ( x > y)
        {
            return -1;
        }

        return 1;

    };

    $.fn.dataTableExt.oSort["customdate-asc"] = function (x, y)
    {
        
        x = convert_sort_value(x);
        y = convert_sort_value(y);

        if ( x > y)
        {
            return 1;
        }

        return -1;
    }
    
    function convert_sort_value(str)
    {
        /* 14th August, 18:39 */

        if (str == null || str == 'null') return 0;
        var date_part = str.split(",")[0];
        var time_part = str.split(",")[1];
        
        var res = time_part.split(":")[1] + time_part.split(":")[0] * 100;
        res += monthNames.indexOf(date_part.split(" ")[1]) * 1000000 + date_part.split(" ")[0].slice(0, -2) * 10000

        return res;
    }

    var t = $("#tracker-table").DataTable({
        "dom"           : 'Bfrtip',
        "ajax"          : "/data",
        "bPaginate"     : false,
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
        "processing": false,
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
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 3,
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 4,
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 5,
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 6,
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 7,
                "orderable": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 8,
                "orderable": false,
                "render": function ( data, type, row ) {
                    const milliseconds = Number(data) * 1000

                    const dateObject = new Date(milliseconds)
                    
                    // const humanDateFormat = dateObject.toLocaleString().split(",")[0]
                    const humanDateFormat = ordinal_suffix_of(dateObject.getDate()) + " " + monthNames[dateObject.getMonth()] + ", "
                                            + dateObject.getHours() + ":" + dateObject.getMinutes();
                    
                    var timeInterval = timeConversion(milliseconds)

                    var content = `<span class="text-cyan full-date" style="display: none;">${humanDateFormat}</span>
                    <span class="text-cyan interval-days" style="display: block;">${timeInterval}</span>`
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
                                            + dateObject.getHours() + ":" + dateObject.getMinutes();
                    return humanDateFormat
                }
            },
            {
                "targets": 10,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = Math.round(data / 100 * row[7])
                    return `<span class="crypto-value">${val}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 11,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = Math.round(data / 100 * row[7])
                    return `<span class="crypto-value">${val}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 12,
                "orderable": false,
                "visible": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 13,
                "orderable": false,
                "visible": false,
                "render": function ( data, type, row ) {
                    return `<span class="crypto-value">${data}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 14,
                "orderable": false,
                "render": function (data, type, row) {
                    return `<span><i class="bi bi-pencil-square btn-action bg-green-2"></i></span>
                            <span><i class="bi bi-trash btn-action bg-blue-2"></i></span>`
                }
            }
        ],
        "columns": [
            { "width": "3%", "mData": null },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "15%" },
            { "width": "15%" },
            { "width": "5%" },
            { "width": "5%" },
            { "width": "4%" },
            { "width": "4%" },
            { "width": "19%" }
        ],
        "bFilter"       : false
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

    $("#export_btn").on("click", function (ev) {
        $(".buttons-excel").trigger("click");
    });
})