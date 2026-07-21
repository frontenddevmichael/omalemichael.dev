export default function SpecSection({ id, num, title, children, className = '', sectionRef, style }) {
  const inner = (
    <div className="container" style={sectionRef ? {position:'relative',zIndex:1} : undefined}>
      <div className="section-grid">
        <div className="spec-h stagger-left">
          <span className="num">-- {num}</span>
          <h2>{title}</h2>
          <span className="dim"></span>
        </div>
        <div className="section-body">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <section className={`section ${className}`} id={id} ref={sectionRef} style={style}>
      {inner}
    </section>
  );
}
