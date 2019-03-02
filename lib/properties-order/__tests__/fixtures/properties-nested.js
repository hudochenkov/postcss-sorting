const Component = styled.div`
	z-index: 1;
	top: 1px;
	position: absolute;
	display: block;

	div {
		z-index: 2;
		position: static;
		top: 2px;
		display: inline-block;

		span {
			z-index: 3;
			top: 3px;
			display: flex;
			position: relative;
		}
	}

	${Container} {
		z-index: 4;
		top: 4px;
		display: inline;
		position: fixed;
	}
`;
