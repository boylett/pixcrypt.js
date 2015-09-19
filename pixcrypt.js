/* PixCrypt v1.0.2 for Javascript | © Ryan Boylett 2013 - 2014 */
var Pixcrypt = function()
{
	var char_to_colour = function(char_at)
	{
		var colour = [],
			char_at = char_at.charCodeAt();

		while(char_at > 255)
		{
			colour.push(255);
			char_at -= 255;
		}

		if(colour.length < 4)
			colour.push(char_at);

		while(colour.length < 4)
			colour.push(0);

		return colour;
	};

	this.cache = document.createElement('canvas');

	this.encode = function(input)
	{
		var input_length, colours;

		if(typeof input == 'object' || typeof input == 'array')
		{
			if(!JSON) throw new Error('Cannot parse input type [' + (typeof input) + '] without JSON');
			input = JSON.stringify(input);
		}

		input = String(input).replace(/(\r\n|\r|\n)/, '\n');
		input_length = input.length;
		colours = [];

		for(i = 0; i < input_length; i++)
			colours.push(char_to_colour(input[i]));

		this.cache.width = colours.length;
		this.cache.height = 1;

		var ctx = this.cache.getContext('2d');

		for(x in colours)
		{
			ctx.fillStyle = 'rgba(' + colours[x][0] + ', ' + colours[x][1] + ', ' + colours[x][2] + ', ' + (255 - colours[x][3]) + ')';
			ctx.fillRect(x, 0, 1, 1);
		}

		return this.cache.toDataURL();
	};

	this.decode = function(input)
	{
		var container, result = '',
			valid_result = '',
			is_object = false;

		if(typeof input == 'string')
		{
			var image = document.createElement('img');
				container = document.createElement('div');
				image.src = input;
				input = image;
				container.style.position = 'absolute';
				container.style.top = '-999999px';
				container.style.left = '-999999px';
				document.body.appendChild(container);
				container.appendChild(image);
		}

		if(typeof input == 'object' && (input instanceof HTMLImageElement || input instanceof HTMLCanvasElement))
		{
			this.cache.width = (input.width ? input.width : input.clientWidth);
			this.cache.height = (input.height ? input.height : input.clientHeight);

			input.crossOrigin = 'Anonymous';

			var ctx = this.cache.getContext('2d');
				ctx.drawImage(input, 0, 0);

			for(y = 0; y < this.cache.height; y++)
			{
				for(x = 0; x < this.cache.width; x++)
				{
					var img_data = ctx.getImageData(x, y, 1, 1);
					for(i = 0; i < img_data.data.length; i += 4)
					{
						var colour = [img_data.data[i], img_data.data[i + 1], img_data.data[i + 2], img_data.data[i + 3]];
							colour[3] = 255 - colour[3];
							colour = colour[0] + colour[1] + colour[2] + colour[3];
							colour = String.fromCharCode(colour);
							result += colour;
					}
				}
			}

			if(container) container.parentNode.removeChild(container);
		}

		if(result.match(/^([\s]+)?({|\[)(.*?)(}|\])([\s]+)?$/))
			is_object = true;

		for(i = 0; i < result.length; i++)
			if(result[i].charCodeAt() > 0)
				valid_result += result[i];

		if(is_object)
			result = JSON.parse(result);

		return (result == '' ? undefined : result);
	};
};
