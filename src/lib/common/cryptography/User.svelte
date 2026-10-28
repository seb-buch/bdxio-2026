<script lang="ts">
	type Props = {
		size?: string;
		faceColor?: string;
		shirtColor?: string;
		name?: string;
	};

	const {
		size = '192',
		faceColor = '#f2d0b4',
		shirtColor = '#5b99d2',
		name = 'Alice'
	}: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 50.8 50.8" xmlns="http://www.w3.org/2000/svg"
	><path
		style="fill:{shirtColor};"
		d="m 7.2054204,44.176703 c 0,-5.545086 3.9298976,-12.591814 9.4561156,-15.780867 4.306611,4.304578 13.505151,3.969899 17.47693,0 5.916357,3.414189 9.456118,10.013969 9.456118,15.780867 z"
	/><ellipse
		style="fill:{faceColor};"
		cx="25.4"
		cy="16.750059"
		rx="10.085252"
		ry="10.080478"
	/></svg
>
<p style:--user-size={size}>{name}</p>

<style>
	svg {
		path,
		ellipse {
			fill-opacity: 1;
			stroke: #17395c;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-dasharray: none;
			stroke-opacity: 1;
		}
	}
	p {
		width: fit-content;
		margin-inline: auto;
		padding: 2px 4px;
		font-size: calc(28px * var(--user-size, 192) / 192);
		background: #d0e8f4;
		color: #0d1b2a;
		line-height: 1;
		border: #0d1b2a solid 3px;
		border-radius: 8px;
	}
</style>
