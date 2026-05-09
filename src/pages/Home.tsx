import halteres from "../assets/halteres.jpg"
import vazio from "../assets/vazio.jpg"
import terra from "../assets/terra.jpg"
import peso from "../assets/peso.jpg"

export const Home = () => {
    return (
        <div className="container pb-4">
            <div className="d-flex flex-column gap-3 py-3">
                <div className="home-card">
                    <img src={halteres} className="home-card-img" alt="halteres" />

                    <div className="home-card-body">
                        <h5 className="home-card-title">Cadastrar treino</h5>
                        <p className="home-card-text">
                            Monte seu treino por dia da semana
                        </p>

                        <a href="/registrar" className="btn btn-primary btn-sm">
                            Cadastrar
                        </a>
                    </div>
                </div>

                <div className="home-card">
                    <img src={vazio} className="home-card-img" alt="academia" />

                    <div className="home-card-body">
                        <h5 className="home-card-title">Últimos treinos</h5>
                        <p className="home-card-text">
                            Veja os treinos que você já registrou
                        </p>

                        <a href="/ultimos-treinos" className="btn btn-primary btn-sm">
                            Buscar
                        </a>
                    </div>
                </div>

                <div className="home-card">
                    <img src={terra} className="home-card-img" alt="academia" />

                    <div className="home-card-body">
                        <h5 className="home-card-title">Treino de Hoje</h5>
                        <p className="home-card-text">
                            Cadastre o seu treino de hoje
                        </p>

                        <a href="/registrar-hoje" className="btn btn-primary btn-sm">
                            Cadastrar
                        </a>
                    </div>
                </div>


                <div className="home-card">
                    <img src={peso} className="home-card-img" alt="academia" />

                    <div className="home-card-body">
                        <h5 className="home-card-title">Buscar por dia</h5>
                        <p className="home-card-text">
                            Veja os últimos 3 treinos registrados por dia da semana
                        </p>

                        <a href="/ultimos-dia" className="btn btn-primary btn-sm">
                            Buscar
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}