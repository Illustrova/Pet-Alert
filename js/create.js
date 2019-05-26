var FILE_TYPES = ['image/jpeg', 'image/png'];

document.addEventListener('DOMContentLoaded', function() {
	var dropZone = document.getElementById('drop-zone');
	var uploadInput = document.getElementById('js-upload-files');

	var startUpload = function(files) {
		removeAlert();
		validateFiles(files);
		handleFiles(files);
	};

	uploadInput.addEventListener('input', function(e) {
		var uploadFiles = uploadInput.files;
		if (uploadFiles) {
			e.preventDefault();
			startUpload(uploadFiles);
		}
	});

	dropZone.ondrop = function(e) {
		e.preventDefault();
		this.className = 'upload-drop-zone';
		startUpload(e.dataTransfer.files);
	};

	dropZone.ondragover = function() {
		this.className = 'upload-drop-zone drop';
		return false;
	};

	dropZone.ondragleave = function() {
		this.className = 'upload-drop-zone';
		return false;
	};

	//TOGGLE Buttons
	toggleBtns = [
		document.getElementById('missing'),
		document.getElementById('found'),
	];
	alertForm = document.getElementById('alertForm');

	toggleBtns.forEach(function(elem) {
		elem.addEventListener('change', function(e) {
			toggleBtns.forEach(function(el) {
				el.labels[0].classList.toggle('active');
				alertForm.classList = elem.value;
			});
		});
	});

	// Reward amount input
	var rewardCB = document.getElementById('reward');
	var rewardInputGroup = document
		.getElementById('reward-amount')
		.closest('.form-group');

	rewardCB.addEventListener('change', function() {
		if (this.checked) {
			rewardInputGroup.classList.remove('hide-all');
			rewardInputGroup.classList.add('hide-found');
		} else {
			rewardInputGroup.classList.remove('hide-found');
			rewardInputGroup.classList.add('hide-all');
		}
	});
	//Prefill date
	date = document.getElementById('seen_date');
	date.valueAsDate = new Date();
});

function removeImage(e) {
	var target = e.target;
	parent = target.parentElement;
	parent.remove();
}

function validateFiles(files) {
	files = [].slice.call(files);
	var invalidFiles = [];
	files.forEach(function(file) {
		if (FILE_TYPES.indexOf(file.type) < 0) {
			invalidFiles.push(file.name);
		}
	});
	if (invalidFiles.length > 0) {
		alertInvalidFile(invalidFiles);
	}
}

function alertInvalidFile(files) {
	alertHTML = `<div id="invalid-file-alert" class="alert alert-danger alert-dismissible fade show" role="alert">
		<strong>Following files was not loaded.</strong>
		<small class="d-block py-1">Please upload jpeg or png images</small>
		<ul class="list-unstyled">${files
			.map(function(file) {
				return '<li class="text-truncate">' + file + '</li>';
			})
			.join('')}</ul>
		<button
			type="button"
			class="close"
			data-dismiss="alert"
			aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>`;
	var alertFragment = document
		.createRange()
		.createContextualFragment(alertHTML);
	var dropZone = document.getElementById('drop-zone');
	dropZone.parentNode.appendChild(alertFragment.firstChild);
}

function removeAlert() {
	var alert = document.getElementById('invalid-file-alert');
	if (alert) {
		alert.parentNode.removeChild(alert);
	}
}
function handleFiles(files) {
	//Check File API support
	if (window.File && window.FileList && window.FileReader) {
		var output = document.getElementById('result');
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			//Only pics
			if (!file.type.match('image')) continue;

			var picReader = new FileReader();
			picReader.addEventListener('load', function(event) {
				var picFile = event.target;
				var div = document.createElement('div');
				div.setAttribute('class', 'position-relative');
				div.innerHTML =
					"<img class='img-thumbnail img-fluid' src='" +
					picFile.result +
					"'" +
					"title='" +
					file.name +
					"'/><button onclick='removeImage(event)' type='button' class='close image--remove' aria-label='Remove image " +
					file.name +
					"><span aria-hidden='true'>&times;</span></button>";
				output.insertBefore(div, null);
			});
			//Read the image
			picReader.readAsDataURL(file);
		}
	} else {
		console.log('Your browser does not support File API');
	}
}
