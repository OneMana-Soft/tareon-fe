import {useParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useTranslation} from "react-i18next";
import MemberContent from "@/components/team/memberContent.tsx";


interface MemberCardInterface {
    isAdmin: boolean
}

const MembersCard: React.FC<MemberCardInterface> = ({isAdmin}) => {

    const {teamId} = useParams()
    const {t} = useTranslation()

    return (

        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>
                    {t('members')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <MemberContent teamId={teamId||''} isAdmin={isAdmin}/>
            </CardContent>

        </Card>

    );
};

export default MembersCard;
