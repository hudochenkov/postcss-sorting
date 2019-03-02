const Component = styled.div`
	z-index: 2;
	top: 0;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;
`;
