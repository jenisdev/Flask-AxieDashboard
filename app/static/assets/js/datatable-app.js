$(document).ready(function () {
    var currency_signs = { 'gbp': "&pound;", 'eur': "&euro;", 'usd': "&dollar;", 'php': "&#8369;" }

    $('td:nth-child(13), th:nth-child(13)').hide();
    $('td:nth-child(14), th:nth-child(14)').hide();
    
/*     $('#tracker-table').DataTable( {
        ajax: '/data',
        dataSrc: 'data',
        columns: [
            { "data": "name" },
            { "data": "ronin" },
            { "data": "total" },
            { "data": "unclaimed" },
            { "data": "claimed" },
            { "data": "manager" },
            { "data": "scholar" },
            { "data": "lastclaim" },
            { "data": "nextclaim" },
            { "data": "mmr" },
            { "data": "arena_rank" },
            { "data": "daily_avg" },
            { "data": "today_total" },
            { "data": "yesterday_total" }
        ]
    } );
 */    
    $('input[name=full_date]').change(ev => {
        if ($(ev.target).prop('checked')) {
            $('.full-date').prop('style', 'display: block;')
            $('.days').prop('style', 'display: none')
        } else {
            $('.days').prop('style', 'display: block;')
            $('.full-date').prop('style', 'display: none')
        }
    })

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

    $('input[name=show_mmr]').change(ev => {
        if ($(ev.target).prop('checked')) {
            $('td:nth-child(13), th:nth-child(13)').show();
        } else {
            $('td:nth-child(13), th:nth-child(13)').hide();
        }
    })

    $('input[name=show_rank]').change(ev => {
        if ($(ev.target).prop('checked')) {
            $('td:nth-child(14), th:nth-child(14)').show();
        } else {
            $('td:nth-child(14), th:nth-child(14)').hide();
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

    /* $('#sort-column').change(ev => {
        var column = Number($('#sort-column option:selected').val())
        var order = Number($('#sort-order option:selected').val())
        sortTable(column, order)
    }) */

    $('#sort-order').change(ev => {
        var column = Number($('#sort-column option:selected').val())
        var order = Number($('#sort-order option:selected').val())
        sortTable(column, order)
    })

    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tracker-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
})