```ts
export const TagItem = styled.span<{ background: string; color: string }>`
  padding: 2px 10px;
  background: ${(props) => props.background};
  border-radius: 4px;

  text-align: center;
  font-size: 12px;
  color: ${(props) => props.color};
`;

export interface TagProps {
  children?: string;
  bgColor?: string;
  color?: string;
  style?: CSSProperties;
  className?: string; // 注意这里，组件必须有className属性并设置到真实dom， styled会生成style并注入混淆的className
}

export const Tag: React.FC<TagProps> = ({
  children,
  bgColor = 'rgba(23, 138, 237, 0.05)',
  color = '#178aed',
  style,
  className,
}) => (
  <TagItem className={className} background={bgColor} color={color} style={style}>
    {children}
  </TagItem>
);

export const CardTag = styled(Tag)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

```
