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

    $(".page-link").click(ev => {
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
    })

    var t = $("#tracker-table").DataTable({
        "ajax":     "/data",
        "dataSrc":  "",
        "bPaginate": false,
        "columnDefs": [
            {
                "targets": 0,
                "searchable": false,
                "orderable": false
            },
            {
                "targets": 1,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var content = `<a class="link-primary" href="https://marketplace.axieinfinity.com/profile/ronin:nin:${row[0]}/axie"
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

                    const humanDateFormat = dateObject.toLocaleString()
                    
                    var timeInterval = timeConversion(milliseconds)

                    var content = `<span class="text-cyan full-date" style="display: none;">${humanDateFormat}</span>
                    <span class="text-cyan interval-days" style="display: block;">${timeInterval}</span>`
                    return content
                }
            },
            {
                "targets": 9,
                "orderable": false,
                "render": function ( data, type, row ) {
                    const milliseconds = Number(data) * 1000

                    const dateObject = new Date(milliseconds)

                    const humanDateFormat = dateObject.toLocaleString()
                    return humanDateFormat
                }
            },
            {
                "targets": 10,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = data / 100 * row[7]
                    return `<span class="crypto-value">${val.toFixed(2)}</span><br><span class="currency-value">`
                }
            },
            {
                "targets": 11,
                "orderable": false,
                "render": function ( data, type, row ) {
                    var val = data / 100 * row[7]
                    return `<span class="crypto-value">${val.toFixed(2)}</span><br><span class="currency-value">`
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
            // { "visible": false,  "targets": [ 3 ] }
        ],
        "columns": [
            { "width": "2%" },
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
            { "width": "20%" }
        ],
        "bFilter": false,
    })

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
        var order = Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'des';
        // Sort by column 1 and then re-draw
        console.log(t)
        t
        .order( [ column, order ] )
        .draw();
        console.log(column, order)
    } );

    
    $('#sort-order').on( 'change', function (e) {
        var column = Number($('#sort-column option:selected').val())
        var order = Number($('#sort-order option:selected').val()) == 0 ? 'asc' : 'des';
        // Sort by column 1 and then re-draw
        console.log(t)
        t
        .order( [ column, order ] )
        .draw();
        console.log(column, order)
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
})