function f360Number()
{
	$('.f360-number').on("keyup", function()
	{
		var value = $(this).val();
		value = value.toString();
		value = value.replace(".", "");
		value = value.replace(",", "");
		value = (value / 100.0).toFixed(2);
		$(this).val(value);
	});
}