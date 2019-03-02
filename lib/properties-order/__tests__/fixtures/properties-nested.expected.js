const Component = styled.div`
	position: absolute;
	top: 1px;
	display: block;
	z-index: 1;

	div {
		position: static;
		top: 2px;
		display: inline-block;
		z-index: 2;

		span {
			position: relative;
			top: 3px;
			display: flex;
			z-index: 3;
		}
	}

	${Container} {
		position: fixed;
		top: 4px;
		display: inline;
		z-index: 4;
	}
`;
