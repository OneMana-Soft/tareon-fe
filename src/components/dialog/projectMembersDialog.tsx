import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState} from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
 TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";
import { Input } from "@/components/ui/input.tsx";
import projectService from "@/services/ProjectService.ts";
import {Separator} from "@/components/ui/separator.tsx";
import MemberInfo from "@/components/team/memberInfo.tsx";
import * as React from "react";
import profileService, {UserProfileDataInterface} from "@/services/ProfileService.ts";
import AddProjectMemberCombobox from "@/components/dialog/addProjectMemberCombobox.tsx";
import {useTranslation} from "react-i18next";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  projectId: string;
}

const ProjectMemberDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
    projectId
}) => {
  const { toast } = useToast();

  const projectInfo = projectService.getProjectMemberList(projectId)
  const selfProfile = profileService.getSelfUserProfile()
  const usersList = profileService. usersListWhoDontBelongToTheProjectButBelongToTheTeam(projectId||'')

  const [query, setQuery] = useState('')
  const {t} = useTranslation()


  const isAdmin = projectInfo.projectData?.data.project_is_admin || projectInfo.projectData?.data.project_team.team_is_admin || false
  let foundSelf = false

  const filteredProject =
      query === ''
          ? projectInfo.projectData?.data.project_members
          : projectInfo.projectData?.data.project_members.filter((member) =>
          member.user_name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
      ) || [] as UserProfileDataInterface[]



  const handleMakeAdmin = async (id: string) => {
    if(!id) return

    try {
      await projectService.AddAdminRole({project_uuid:projectId, project_member_uuid:id})
      toast({
        title: t('success'),
        description: t('addedAdmin'),
      });
      await projectInfo.Mutate()

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToAddAdminRole')}: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  const handleRemoveAdmin = async (id: string) => {
    if(!id || !projectId) return

    try {
      await projectService.RemoveAdmin(projectId, id)
      toast({
        title: t('success'),
        description: t('removeAdminRole'),
      });
      await projectInfo.Mutate()

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToRemoveAdminRole')}: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  const handleAddMember = async (id: string) => {
    if(!id) return

    try {
      await projectService.AddMember({project_uuid:projectId, project_member_uuid:id})
      toast({
        title: t('success'),
        description: t('addedProjectMember'),
      });
      await projectInfo.Mutate()
      await usersList.mutate()


    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToAddProjectMember')}: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  const handleRemoveMember = async (id: string) => {
    if(!id || !projectId) return

    try {
      await projectService.RemoveMember(projectId, id)
      toast({
        title: t('success'),
        description: t('removeProjectMember'),
      });
      await projectInfo.Mutate()
      await usersList.mutate()


    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToRemoveProjectMember')}: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  function closeModal() {
    setOpenState(false);
  }

  return (
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>
      {/*<DialogTrigger asChild>*/}
      {/*    <Button variant="secondary">Save</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>{projectInfo.projectData?.data.project_name}</DialogTitle>
          <DialogDescription>
            {t('updateProjectMembers')}
          </DialogDescription>
        </DialogHeader>
        <div className='flex-col space-y-4'>

          <div>
            {isAdmin && <AddProjectMemberCombobox handleAddMember={handleAddMember} projectId={projectId}/>}
          </div>
          <div>

          <Input
              type="text"
              placeholder={"member search"}
              // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
              onChange={(event) => setQuery(event.target.value)}
          />

          <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
            {filteredProject?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  {t('noProjectFound')}
                </div>
            ) : (filteredProject?.map((user, i) => {
              let s = false
              if (!foundSelf) {
                if (selfProfile.userData?.data.user_uuid == user.user_uuid) {
                  foundSelf = true
                  s = true
                }
              }

              return (

                  <div key={(user.user_uuid)}>
                    <Separator orientation="horizontal" className={i ? 'invisible' : ''}/>
                    <MemberInfo userInfo={user} isAdmin={isAdmin} handleRemoveMember={handleRemoveMember}
                                handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin} isSelf={s}/>
                    <Separator orientation="horizontal" className=""/>

                  </div>
              )
            }))}
          </div>
          </div>
        </div>
        {/*<DialogFooter>*/}
        {/*  <Button onClick={handleSubmit} disabled={disableButton}>*/}
        {/*    Update*/}
        {/*  </Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMemberDialog;
